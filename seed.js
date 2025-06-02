import bcrypt from "bcrypt";
import User from "./models/User.js";
import { connectDB } from "./db/connection.js";

const register = async () => {
  try {
    connectDB();
    const hashPassword = await bcrypt.hash("Satinder_Admin@123", 10);
    const newUser = new User({
      name: "Satinder Singh Sall",
      email: "satindersinghsall111@gmail.com",
      password: hashPassword,
      address: "Admin Address",
      role: "Admin",
    });

    await newUser.save();
    console.log(
      `📊 Admin: ${newUser.name} added as ${newUser.role} successfully!`
    );
  } catch (error) {
    console.log(`❌ Fail to add as an Admin, errors: ${error}`);
  }
};

register();
