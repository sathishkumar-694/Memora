const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, adminLogin, deleteUser } = require("../controller/adminController");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

// Public Admin Route
router.post("/login", adminLogin);

// Protected Admin Routes
router.use(verifyToken);
router.use(verifyAdmin);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);

module.exports = router;
