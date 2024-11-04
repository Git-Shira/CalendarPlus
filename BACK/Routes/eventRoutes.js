const express = require("express");
const router = express.Router();

const eventController = require('../Controllers/eventController');

const auth = require('../Middleware/auth'); // Import the auth middleware

router.post("/new-event",auth, eventController.createEvent);
router.put("/update-event/:id",auth, eventController.updateEvent);
router.delete("/delete-event/:id",auth, eventController.deleteEvent);
router.get("/all-events",auth, eventController.getAllEvents);

module.exports = router;