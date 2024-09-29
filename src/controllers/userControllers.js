import { User } from "../models/userModel.js"; // Adjust the import path based on your directory structure
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";

// Creating a hashed password
const hashPassword = async (password) => {
  const saltRounds = 10; // Higher salt rounds = more secure, but slower
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    // Checks if the user already exists before creating a new user.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }
    //  Hashes the user's password before saving it to the database.
    // registering the new user
    const user = new User({
      email: email,
      name: name,
      phone: phone,
      address: address,
      created_at: new Date(),
      updated_at: new Date(),
      password: await hashPassword(password),
    });
    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    //  Responds with a success message and the created user if successful.
    await user.save();
    res.status(201).json({
      success: true,
      message: "User Created",
      user: user,
      token: token,
    });
  } catch (error) {
    //Handles errors by returning an error message with status code 500.
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Read user details
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({
        success: true,
        message: "User not found",
      });

    res.status(200).json({
      success: true,
      message: "User found",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user details

export const updateUser = async (req, res) => {
  const { name, email, phone, address, past_bookings, payment_methods } =
    req.body;
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // If the user has an existing profile image, delete it
    if (user.profile_image) {
      const oldImagePath = path.join(
        __dirname,
        "../../uploads",
        user.profile_image
      );
      // Check if the old image exists and delete it
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image
      }
    }

    user.profile_image = req.file.filename;

    // Update other fields only if they exist in the request
    user.name = name !== undefined ? name : user.name;
    user.email = email !== undefined ? email : user.email;

    user.phone = phone !== undefined ? phone : user.phone;
    user.address = address !== undefined ? address : user.address;

    // Update past_bookings if provided
    if (Array.isArray(past_bookings)) {
      user.past_bookings = past_bookings;
    }

    // Update payment_methods if provided
    if (Array.isArray(payment_methods)) {
      user.payment_methods = payment_methods;
    }

    user.updated_at = new Date(); // Set the updated timestamp

    await user.save(); // Save the updated user to the database

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedUser: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(204).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: " Failed to delete user",
    });
  }
};

// List all users (optional, depending on your use case)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params; // Get userId from request params
    const { oldPassword, newPassword } = req.body; // Get old and new password from request body

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }

    // Find user by ID
    const user = await User.findById(id); // Assuming you're using Mongoose
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare old password with the stored hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect." });
    }

    // Hash the new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    // Send success response
    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Respond with success message and token
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token, // Return the token if using JWT
    });
  } catch (error) {}
};
