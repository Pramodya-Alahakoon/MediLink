import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import verifyToken from "./middleware/authMiddleware.js";
import authRoutes from "./routes/auth.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

app.use("/api/auth", authRoutes);
app.use("/api/notification", notificationRoutes);

app.use("/api/patient", verifyToken, patientRoutes);
app.use("/api/doctor", verifyToken, doctorRoutes);
app.use("/api/appointment", verifyToken, appointmentRoutes);
app.use("/api/payment", verifyToken, paymentRoutes);
app.use("/api/ai", verifyToken, aiRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API Gateway running" });
});

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
