import axios from "axios";

/**
 * Somali Telecom Carriers & Prefixes for Direct SIM SMS:
 * - Hormuud: 61, 77 (061, 077, +252 61, +252 77)
 * - Somtel: 62, 65, 66 (062, 065, 066, +252 62, +252 65, +252 66)
 */
export const identifySomaliCarrier = (phone) => {
  if (!phone) return { carrier: "Unknown", prefix: "", isSupported: false };
  let clean = phone.toString().replace(/\D/g, "");

  if (clean.startsWith("252")) {
    clean = clean.substring(3);
  }
  if (clean.startsWith("0")) {
    clean = clean.substring(1);
  }

  if (clean.startsWith("61") || clean.startsWith("77")) {
    return { carrier: "Hormuud", prefix: clean.substring(0, 2), isSupported: true, subscriber: clean };
  }
  if (clean.startsWith("62") || clean.startsWith("65") || clean.startsWith("66")) {
    return { carrier: "Somtel", prefix: clean.substring(0, 2), isSupported: true, subscriber: clean };
  }

  return { carrier: "Other", prefix: clean.substring(0, 2), isSupported: false, subscriber: clean };
};

/**
 * Format phone for Somali Telecom SMS: `25261XXXXXXX` or `25262XXXXXXX`
 */
export const formatForSomaliSMS = (phone) => {
  if (!phone) return "";
  let clean = phone.toString().replace(/\D/g, "");
  if (clean.startsWith("0")) {
    clean = "252" + clean.substring(1);
  } else if (!clean.startsWith("252") && clean.length <= 9) {
    clean = "252" + clean;
  }
  return clean;
};

/**
 * Helper to build clear Somali Emergency Mobile SMS text
 */
export const buildEmergencySMSText = (donorName = "Walaal", hospitalName = "Isbitaalka", hospitalLocation = "Mogadishu", patientInfo = null) => {
  const dName = donorName || "Walaal";
  const hName = hospitalName || "Isbitaalka";
  const hLoc = hospitalLocation || "Mogadishu";

  let patientStr = "";
  if (patientInfo && patientInfo.name) {
    patientStr = ` Bukaanka: ${patientInfo.name}${patientInfo.diagnosis ? ` (${patientInfo.diagnosis})` : ""}.`;
  }

  return `Asc Wll ${dName}, waxaa loo baahan yahay dhiig-bixin degdeg ah ${hName} (${hLoc}).${patientStr} Fadlan hadaad awooddo nala soo xiriir ama kaalay isbitaalka. Caawintaadu waa badbaado nololeed. - DhiigKaal System`;
};

/**
 * Send Direct Mobile SMS to donor SIM card (Hormuud / Somtel)
 *
 * @param {string} phone
 * @param {string} messageText
 * @param {object} metadata
 */
export const sendDirectSMS = async (phone, messageText, metadata = {}) => {
  const cleanedPhone = formatForSomaliSMS(phone);
  const carrierInfo = identifySomaliCarrier(phone);

  const nativeSmsUrl = `sms:${cleanedPhone}?body=${encodeURIComponent(messageText)}`;

  console.log(`[Mobile SMS Dispatch] Sending SMS to ${cleanedPhone} (${carrierInfo.carrier})...`);

  let apiSuccess = false;
  let apiResponse = null;

  // 1. Hormuud Bulk SMS API integration (if configured in .env)
  if (carrierInfo.carrier === "Hormuud" && process.env.HORMUUD_SMS_API_URL && process.env.HORMUUD_SMS_API_KEY) {
    try {
      const response = await axios.post(
        process.env.HORMUUD_SMS_API_URL,
        {
          sender: process.env.HORMUUD_SMS_SENDER_ID || "DHIIGKAAL",
          recipient: cleanedPhone,
          message: messageText,
          apikey: process.env.HORMUUD_SMS_API_KEY,
        },
        { timeout: 8000 }
      );
      apiSuccess = true;
      apiResponse = response.data;
      console.log(`[Hormuud SMS] Successfully delivered to ${cleanedPhone}:`, response.data);
    } catch (err) {
      console.error(`[Hormuud SMS Error] Failed to send via API to ${cleanedPhone}:`, err.message);
    }
  }

  // 2. Somtel SMS Gateway API integration (if configured in .env)
  else if (carrierInfo.carrier === "Somtel" && process.env.SOMTEL_SMS_API_URL && process.env.SOMTEL_SMS_API_KEY) {
    try {
      const response = await axios.post(
        process.env.SOMTEL_SMS_API_URL,
        {
          sender_id: process.env.SOMTEL_SMS_SENDER_ID || "DHIIGKAAL",
          mobile: cleanedPhone,
          text: messageText,
          api_key: process.env.SOMTEL_SMS_API_KEY,
        },
        { timeout: 8000 }
      );
      apiSuccess = true;
      apiResponse = response.data;
      console.log(`[Somtel SMS] Successfully delivered to ${cleanedPhone}:`, response.data);
    } catch (err) {
      console.error(`[Somtel SMS Error] Failed to send via API to ${cleanedPhone}:`, err.message);
    }
  }

  return {
    success: true,
    carrier: carrierInfo.carrier,
    isHormuudOrSomtel: carrierInfo.isSupported,
    formattedPhone: cleanedPhone,
    messageText,
    smsUrl: nativeSmsUrl,
    apiDelivered: apiSuccess,
    apiDetails: apiResponse,
  };
};
