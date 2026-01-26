const User = require("../models/User");
const bcrypt = require("bcrypt");
const hashPassword = require("../utils/hashPassword");
const generateToken = require("../utils/generateToken");
const googleClient = require("../utils/googleClient")
exports.register = async (req, res) => {
  try {
    const {
      fname,
      lname,
      email,
      userName,
      password,
      dob,
      gender,
      mobile,
      city,
      district,
      agree,
    } = req.body;

    if (
      !fname ||
      !lname ||
      !email ||
      !password ||
      !dob ||
      !gender ||
      !mobile ||
      !city ||
      !district ||
      agree !== true
    ) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({
      $or: [{ userName }, { email }],
    });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    await User.create({
      fname,
      lname,
      email,
      userName,
      password: await hashPassword(password),
      dob,
      gender,
      mobile,
      city,
      district,
      agree,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for Admin Credentials
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
    }

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      role: "user",
      user: {
        fname: user.fname,
        lname: user.lname,
        userName: user.userName
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "User profile fetched",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fname, lname, dob, gender, mobile, city, district } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (fname) user.fname = fname;
    if (lname) user.lname = lname;
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;
    if (mobile) user.mobile = mobile;
    if (city) user.city = city;
    if (district) user.district = district;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // destructure info from google
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      // Split name into fname and lname
      const names = name ? name.split(" ") : ["User"];
      const fname = names[0];
      const lname = names.length > 1 ? names.slice(1).join(" ") : "";
      
      // Generate a simplified username
      const userName = email.split("@")[0] + Math.floor(Math.random() * 10000);

      user = await User.create({
        fname,
        lname,
        userName,
        email,
        googleId,
        agree: true, // Assuming consent given via Google
      });
    }

    const token = generateToken(user);
    return res.status(200).json({
      message: "google login successful",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Google authentication failed" });
  }
};