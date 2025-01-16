const express = require("express");
const router = express.Router();

const categoryController = require('../Controllers/categoryController');

// Middleware
const SecurityMiddleware = require('../Middleware/securityMiddleware');
const auth = require('../Middleware/auth');

// Categories routes
router.get("/all-categories", auth, categoryController.getAllCategories);
router.post("/new-category", SecurityMiddleware.secure(), auth, categoryController.createCategory);
router.put("/update-category/:id", SecurityMiddleware.secure(), auth, categoryController.updateCategory);
router.delete("/delete-category/:id", SecurityMiddleware.secure(), auth, categoryController.deleteCategory);

module.exports = router;