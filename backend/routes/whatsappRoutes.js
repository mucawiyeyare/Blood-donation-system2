import express from "express";
import {
  getWhatsAppStatus,
  requestPairingCodeForNumber,
  refreshQR,
  sendWhatsAppMessage,
  logoutWhatsApp,
} from "../services/whatsappService.js";

const router = express.Router();

// GET /api/whatsapp/status
router.get("/status", (req, res) => {
  try {
    const status = getWhatsAppStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/whatsapp/refresh-qr
router.get("/refresh-qr", async (req, res) => {
  try {
    const status = await refreshQR();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/whatsapp/pair
router.post("/pair", async (req, res) => {
  try {
    const phone = req.body.phone || "252616408886";
    const result = await requestPairingCodeForNumber(phone);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/whatsapp/test-send
router.post("/test-send", async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });
    const text = message || `Asc Wll,\n\nWaxa kula soo xiriiray Isbitaalka 🏥\n\nWaxaa loo baahan yahay in aad ka qeyb qaadato dhiig-bixin si loogu caawiyo bukaan u baahan dhiig. 🩸❤️\n\nFadlan haddii aad awooddo, booqo Isbitaalka si aad uga qeyb qaadato dhiig-bixinta.\n\nMahadsanid walaal.\nCaawintaadu waxay badbaadin kartaa nolol. ❤️🩸`;
    const result = await sendWhatsAppMessage(phone, text);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/whatsapp/logout
router.post("/logout", async (req, res) => {
  try {
    const result = await logoutWhatsApp();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
