import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import connectDB from "./Db/db.js";

// Routes
import Userrouter from "./routes/userroutes.js";
import Adminrouter from "./routes/Adminroutes.js"; 
import DonorRequestRouter from "./routes/donorRequestRoutes.js"; 
import ContactRouter from "./routes/contactRoutes.js"; 
import ActivityLogRouter from "./routes/activityLogRoutes.js"; 
import WhatsAppRouter from "./routes/whatsappRoutes.js";
import { initWhatsApp } from "./services/whatsappService.js"; 

// Always load the environment file next to this server file
dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required. Add it to backend/.env before starting the API.");
}

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

import path from "path";

// API Routes
app.use("/api/users", Userrouter);
app.use("/api/admin", Adminrouter); 
app.use("/api/requests", DonorRequestRouter); 
app.use("/api/contact", ContactRouter); 
app.use("/api/activity", ActivityLogRouter); 
app.use("/api/whatsapp", WhatsAppRouter);

// Serve frontend static build in production
const __dirname = path.resolve();
const frontendDistPath = path.join(__dirname, "../frontend/dist");

if (process.env.NODE_ENV === "production" || process.env.SERVE_FRONTEND === "true") {
  app.use(express.static(frontendDistPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("🩸 DHIIG KAAL — Blood Donation Management System API is running...");
  });
}

// WhatsApp Gateway Service (Optional in local development)
// initWhatsApp().catch((err) => console.error("[WhatsApp Gateway] Startup error:", err));

app.use((err, req, res, next) => {
  console.error(" Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
