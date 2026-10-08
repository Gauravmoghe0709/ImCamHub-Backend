require ("dotenv").config()
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/model/Auth.model");

const MONGO_URI = process.env.MONGODB_URI;

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    const email = "ImCamHub@admin.com";
    const password = "ImCamHub@admin.com";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("User already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createAdmin();