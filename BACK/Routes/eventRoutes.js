const express = require("express");
const router = express.Router();

const eventController = require('../Controllers/eventController');

// Middleware
const SecurityMiddleware = require('../Middleware/securityMiddleware');
const auth = require('../Middleware/auth'); 

// Events routes
router.get("/all-events", auth, eventController.getAllEvents);
router.post("/new-event", SecurityMiddleware.secure(), auth, eventController.createEvent);
router.put("/update-event/:id", SecurityMiddleware.secure(), auth, eventController.updateEvent);
router.delete("/delete-event/:id", SecurityMiddleware.secure(), auth, eventController.deleteEvent);

module.exports = router;