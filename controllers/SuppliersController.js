import Supplier from "../models/Supplier.js";
import Product from "../models/Product.js";

//! To add a new Supplier:
const addSupplier = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
      return res
        .status(400)
        .json({ success: false, error: "Supplier already exists" });
    }

    const newSupplier = new Supplier({ name, email, phone, address });
    await newSupplier.save();

    res
      .status(201)
      .json({ success: true, message: "Supplier created successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

//! To get Supplier:
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json({ success: true, suppliers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Server error " + error.message });
  }
};

//! To update the Supplier:
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      { name, email, phone, address },
      { new: true }
    );

    if (!updatedSupplier) {
      return res
        .status(404)
        .json({ success: false, error: "Supplier Not Found" });
    }

    res.status(200).json({ success: true, updatedSupplier });
  } catch (error) {
    console.error("Error updating supplier:", error);
    res
      .status(500)
      .json({ success: false, error: "Server error " + error.message });
  }
};

//! To delete a Supplier
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const productCount = await Product.countDocuments({ supplier: id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete supplier with associated products",
      });
    }

    const supplier = await Supplier.findByIdAndDelete(id);
    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, error: "Supplier not found" });
    }

    res.status(200).json({ success: true, supplier });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res
      .status(500)
      .json({ success: false, error: "Server error " + error.message });
  }
};

export { addSupplier, getSuppliers, updateSupplier, deleteSupplier };
