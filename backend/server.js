import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./Db/db.js";

// Routes
import Userrouter from "./routes/userroutes.js";
import Adminrouter from "./routes/Adminroutes.js"; 
import DonorRequestRouter from "./routes/donorRequestRoutes.js"; 
import ContactRouter from "./routes/contactRoutes.js"; 
import ActivityLogRouter from "./routes/activityLogRoutes.js"; 
import WhatsAppRouter from "./routes/whatsappRoutes.js";
import ReportRouter from "./routes/reportRoutes.js";
import NotificationRouter from "./routes/notificationRoutes.js";
import PartnerRouter from "./routes/partnerRoutes.js";
import DoctorRouter from "./routes/doctorRoutes.js";
import ConsultRouter from "./routes/consultRoutes.js";
import { initWhatsApp } from "./services/whatsappService.js";
import { resolveExpiredRequests } from "./controllers/donorRequestController.js";

// Always load the environment file next to this server file
dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required. Add it to backend/.env before starting the API.");
}

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

connectDB();

// A pending blood request auto-expires after 2 hours (see DonorRequest.pendingUntil), and an
// expired request stops counting toward a donor's reserved status, so they show Available again.
// This used to only run opportunistically inside a few request handlers — meaning a request
// could sit expired-but-still-Pending for hours if nobody happened to load an affected page in
// the meantime. Running it on a fixed timer makes expiry happen on schedule regardless of
// traffic, so it doesn't depend on any particular user's browser staying open.
const EXPIRY_CHECK_INTERVAL_MS = 2 * 60 * 1000; // every 2 minutes
resolveExpiredRequests();
setInterval(resolveExpiredRequests, EXPIRY_CHECK_INTERVAL_MS);

// API Routes
app.use("/api/users", Userrouter);
app.use("/api/admin", Adminrouter); 
app.use("/api/requests", DonorRequestRouter); 
app.use("/api/contact", ContactRouter); 
app.use("/api/activity", ActivityLogRouter); 
app.use("/api/whatsapp", WhatsAppRouter);
app.use("/api/reports", ReportRouter);
app.use("/api/notifications", NotificationRouter);
app.use("/api/partners", PartnerRouter);
app.use("/api/doctors", DoctorRouter);
app.use("/api/consult", ConsultRouter);

app.get("/", (req, res) => {
  res.send("🩸 SOBDA — Blood Donation Management System API is running...");
});

// Initialize WhatsApp Gateway Service (set WHATSAPP_ENABLED=false to keep it off,
// e.g. on a standby server that must not share the live WhatsApp login)
if (process.env.WHATSAPP_ENABLED === "false") {
  console.log("[WhatsApp Gateway] Disabled by WHATSAPP_ENABLED=false");
} else {
  initWhatsApp().catch((err) => console.error("[WhatsApp Gateway] Startup error:", err));
}

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Image or payload too large. Please select a smaller photo." });
  }
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
