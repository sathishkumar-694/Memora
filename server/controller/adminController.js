const User = require("../models/User");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (
      userName === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { userId: "admin", role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.status(200).json({
        message: "Admin Login successful",
        token,
        role: "admin",
      });
    } else {
      return res.status(401).json({ message: "Invalid Admin Credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const Note = require("../models/Note");

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Delete all notes associated with this user
    await Note.deleteMany({ user: userId });

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User and their data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user)
       {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { adminLogin, getAllUsers, getUserById, deleteUser };
