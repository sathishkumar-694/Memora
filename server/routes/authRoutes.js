const express = require("express");
const { login, register, profile, updateProfile, googleLogin } = require("../controller/authController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/login" , login);
router.post("/register" , register);
router.post("/google-login",googleLogin)
router.get("/profile" , verifyToken , profile);
router.put("/profile" , verifyToken , updateProfile);

module.exports = router;