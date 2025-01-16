const express = require("express");
const router = express.Router();

const authController = require('../Controllers/authController');

// Middleware
const SecurityMiddleware = require('../Middleware/securityMiddleware');
const auth = require('../Middleware/auth'); 

// Auth routes
router.get("/", SecurityMiddleware.secure(), auth, authController.profile);

router.post("/register", SecurityMiddleware.secure(), authController.register);
router.post("/login", SecurityMiddleware.secure(), authController.login);
router.post("/logout", SecurityMiddleware.secure(), authController.logout);

router.put('/update', SecurityMiddleware.secure(), auth, authController.update);

router.post("/forgot-password", SecurityMiddleware.secure(), authController.forgotPassword);
router.post("/verify-code", SecurityMiddleware.secure(), authController.verifyCode);
router.post("/reset-password", SecurityMiddleware.secure(), authController.resetPassword);

router.delete("/delete", SecurityMiddleware.secure(), auth, authController.delete);

module.exports = router;