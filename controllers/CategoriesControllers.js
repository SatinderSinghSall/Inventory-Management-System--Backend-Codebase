import Category from "../models/Category.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

//! Helper function to validate if a string is non-empty after trimming
const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

//! Helper to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

//! Add a new category:
const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate presence and type for name only, description is optional
    if (!isNonEmptyString(name)) {
      return res.status(400).json({
        success: false,
        error: "Category name is required and cannot be empty",
      });
    }

    // Validate length limits
    if (name.trim().length > 50) {
      return res.status(400).json({
        success: false,
        error: "Category name must be 50 characters or fewer",
      });
    }
    if (description && description.trim().length > 500) {
      return res.status(400).json({
        success: false,
        error: "Category description must be 500 characters or fewer",
      });
    }

    // Check if category already exists (case-insensitive)
    const existingCategory = await Category.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: "Category already exists",
      });
    }

    const newCategory = new Category({
      name: name.trim(),
      description: description ? description.trim() : "",
    });

    await newCategory.save();
    return res
      .status(201)
      .json({ success: true, message: "Category created successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

//! Get all categories:
const getCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Server error: " + error.message });
  }
};

//! Update category:
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid category ID" });
    }

    if (!isNonEmptyString(name)) {
      return res.status(400).json({
        success: false,
        error: "Category name is required and cannot be empty",
      });
    }

    if (name.trim().length > 50) {
      return res.status(400).json({
        success: false,
        error: "Category name must be 50 characters or fewer",
      });
    }

    if (description && description.trim().length > 500) {
      return res.status(400).json({
        success: false,
        error: "Category description must be 500 characters or fewer",
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    const existingCategory = await Category.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
      _id: { $ne: id },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: "Another category with this name already exists",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description ? description.trim() : "",
      },
      { new: true }
    );

    return res.status(200).json({ success: true, category: updatedCategory });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Server error: " + error.message });
  }
};

//! Delete category:
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid category ID" });
    }

    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete category with associated products",
      });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Category deleted", category });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server error: " + error.message });
  }
};

export { addCategory, getCategory, updateCategory, deleteCategory };
