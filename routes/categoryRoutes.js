import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/CategoriesControllers.js";

const router = express.Router();

router.get("/", authMiddleware, getCategory);
router.post("/add", authMiddleware, addCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);

export default router;
