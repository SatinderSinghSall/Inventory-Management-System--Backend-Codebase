import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./db/connection.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import suppliersRoutes from "./routes/suppliersRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT = 5000 || process.env.PORT;

app.use(cors());
app.use(express.json());

//! App Routes:
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/supplier", suppliersRoutes);
app.use("/api/products", productRoutes);

//! MongoDB Database Connection & App Server Status:
app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 App server is running in port: ${PORT}`);
});
