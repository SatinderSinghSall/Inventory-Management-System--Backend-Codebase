import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addOrder,
  getOrders,
  deleteOrder,
} from "../controllers/OrderController.js";

const router = express.Router();

router.get("/:id", authMiddleware, getOrders);
router.post("/add", authMiddleware, addOrder);
router.delete("/:id", authMiddleware, deleteOrder);

export default router;
