import User from "../models/User.js";
import bcrypt from "bcrypt";

// Create a new user
const addUser = async (req, res) => {
  try {
    const { name, email, password, role, address } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error("Error in addUser:", error.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error in getUsers:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Get a single user
const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() !== id) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in getUser:", error.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, address } = req.body;

    const updateData = { name, email, address };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error in updateUser:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "User deleted", user });
  } catch (error) {
    console.error("Error in deleteUser:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export { addUser, getUsers, getUser, updateUser, deleteUser };
