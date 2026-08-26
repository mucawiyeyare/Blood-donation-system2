import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authDir = path.join(__dirname, "../auth_info_baileys");

if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

// Global WhatsApp state
let sock = null;
let connectionStatus = "disconnected"; // 'disconnected' | 'connecting' | 'qr_ready' | 'connected'
let qrCodeData = null; // Data URL for image rendering
let rawQr = null;
let pairingCode = null;
let connectedNumber = null;
let reconnectAttempts = 0;

/**
 * Format any Somalia phone number into standard WhatsApp JID format
 * e.g. "616408886" -> "252616408886@s.whatsapp.net"
 */
export const formatSomaliPhone = (phone) => {
  if (!phone) return "";
  let cleaned = phone.toString().replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "252" + cleaned.substring(1);
  } else if (!cleaned.startsWith("252") && cleaned.length <= 9) {
    cleaned = "252" + cleaned;
  }
  return `${cleaned}@s.whatsapp.net`;
};

/**
 * Initialize WhatsApp Socket Connection
 */
export const initWhatsApp = async () => {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(authDir);
    const { version, isLatest } = await fetchLatestBaileysVersion();

    console.log(`[WhatsApp Gateway] Starting Baileys v${version.join(".")} (Latest: ${isLatest})...`);
    connectionStatus = "connecting";

    sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false, // We render QR in Admin UI and API
      logger: pino({ level: "silent" }),
      browser: ["DHIIG KAAL Somalia", "Chrome", "1.0.0"],
      generateHighQualityLinkPreview: false,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        rawQr = qr;
        try {
          qrCodeData = await qrcode.toDataURL(qr);
          connectionStatus = "qr_ready";
          console.log("[WhatsApp Gateway] New QR code generated for authentication");
        } catch (err) {
          console.error("[WhatsApp Gateway] QR generation error:", err);
        }
      }

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        connectionStatus = "disconnected";
        qrCodeData = null;
        rawQr = null;
        pairingCode = null;
        connectedNumber = null;

        console.log(`[WhatsApp Gateway] Connection closed. Reason: ${statusCode || lastDisconnect?.error?.message}`);

        if (shouldReconnect && reconnectAttempts < 10) {
          reconnectAttempts++;
          const delay = Math.min(reconnectAttempts * 3000, 30000);
          console.log(`[WhatsApp Gateway] Reconnecting in ${delay / 1000}s (Attempt ${reconnectAttempts})...`);
          setTimeout(() => {
            initWhatsApp();
          }, delay);
        } else if (!shouldReconnect) {
          console.log("[WhatsApp Gateway] Logged out. Session cleared.");
          try {
            fs.rmSync(authDir, { recursive: true, force: true });
          } catch (e) {}
        }
      } else if (connection === "open") {
        reconnectAttempts = 0;
        connectionStatus = "connected";
        qrCodeData = null;
        rawQr = null;
        pairingCode = null;
        connectedNumber = sock?.user?.id?.split(":")[0] || sock?.user?.id || "252616408886";
        console.log(`[WhatsApp Gateway] ✅ Successfully connected to WhatsApp! Logged in as: ${connectedNumber}`);
      }
    });

    return sock;
  } catch (error) {
    console.error("[WhatsApp Gateway] Initialization error:", error);
    connectionStatus = "disconnected";
    return null;
  }
};

/**
 * Request an 8-digit Pairing Code for a phone number (e.g. 252616408886)
 */
export const requestPairingCodeForNumber = async (phoneNumber = "252616408886") => {
  if (!sock) {
    await initWhatsApp();
  }

  let cleaned = phoneNumber.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) cleaned = "252" + cleaned.substring(1);
  else if (!cleaned.startsWith("252") && cleaned.length <= 9) cleaned = "252" + cleaned;

  try {
    if (sock && !sock.authState.creds.registered) {
      console.log(`[WhatsApp Gateway] Requesting pairing code for ${cleaned}...`);
      const code = await sock.requestPairingCode(cleaned);
      pairingCode = code;
      console.log(`[WhatsApp Gateway] 🔑 Pairing Code: ${code}`);
      return { success: true, pairingCode: code, phone: cleaned };
    } else if (sock?.authState?.creds?.registered) {
      return { success: true, alreadyConnected: true, connectedNumber };
    }
  } catch (err) {
    console.error("[WhatsApp Gateway] Pairing code error:", err);
    return { success: false, error: err.message };
  }
  return { success: false, error: "Socket not ready" };
};

/**
 * Send a real WhatsApp text message to any phone number
 */
export const sendWhatsAppMessage = async (toPhone, message) => {
  const targetJid = formatSomaliPhone(toPhone);

  if (!sock || connectionStatus !== "connected") {
    console.warn(`[WhatsApp Gateway] Cannot send message to ${toPhone}: Gateway is ${connectionStatus}`);
    return {
      success: false,
      status: connectionStatus,
      message: `WhatsApp Gateway is currently ${connectionStatus}. Please connect sender number 616408886.`,
      targetPhone: toPhone,
    };
  }

  try {
    console.log(`[WhatsApp Gateway] 📤 Sending message to ${targetJid}: "${message}"`);
    const sentMsg = await sock.sendMessage(targetJid, { text: message });
    console.log(`[WhatsApp Gateway] ✅ Message delivered successfully! ID: ${sentMsg?.key?.id}`);
    return {
      success: true,
      messageId: sentMsg?.key?.id,
      targetJid,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error(`[WhatsApp Gateway] ❌ Failed to send message to ${targetJid}:`, error);
    return {
      success: false,
      error: error.message,
      targetJid,
    };
  }
};

/**
 * Get current Gateway status
 */
export const getWhatsAppStatus = () => {
  return {
    status: connectionStatus,
    connectedNumber,
    qrCode: qrCodeData,
    pairingCode,
    senderNumber: "252616408886",
  };
};

/**
 * Disconnect / Logout WhatsApp session
 */
export const logoutWhatsApp = async () => {
  try {
    if (sock) {
      await sock.logout();
    }
    fs.rmSync(authDir, { recursive: true, force: true });
    connectionStatus = "disconnected";
    qrCodeData = null;
    pairingCode = null;
    connectedNumber = null;
    setTimeout(() => initWhatsApp(), 2000);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
