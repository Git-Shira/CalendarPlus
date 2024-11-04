const express = require("express");
const router = express.Router();

const authController = require('../Controllers/authController');

// Middleware
const SecurityMiddleware = require('../Middleware/securityMiddleware');

// Auth routes
router.post("/register", SecurityMiddleware.secure(), authController.register);
router.post("/login", SecurityMiddleware.secure(),  authController.login);
router.post("/logout", SecurityMiddleware.secure(), authController.logout);

module.exports = router;