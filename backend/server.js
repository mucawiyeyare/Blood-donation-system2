import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Db/db.js";

// Routes
import Userrouter from "./routes/userroutes.js";
import Adminrouter from "./routes/Adminroutes.js"; 
import DonorRequestRouter from "./routes/donorRequestRoutes.js"; 
import ContactRouter from "./routes/contactRoutes.js"; 
import ActivityLogRouter from "./routes/activityLogRoutes.js"; 
dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


connectDB();


app.get("/", (req, res) => {
  res.send(" Blood Donation Management System (BDMS) API is running...");
});

// API Routes
app.use("/api/users", Userrouter);
app.use("/api/admin", Adminrouter); // 
app.use("/api/requests", DonorRequestRouter); 
app.use("/api/contact", ContactRouter); 
app.use("/api/activity", ActivityLogRouter); 
app.use((err, req, res, next) => {
  console.error(" Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
