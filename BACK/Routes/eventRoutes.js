const express = require("express");
const router = express.Router();

const eventController = require('../Controllers/eventController');

router.post("/new-event", eventController.createEvent);
router.put("/update-event/:id", eventController.updateEvent);
router.delete("/delete-event/:id", eventController.deleteEvent);
router.get("/all-events/:id", eventController.getAllEvents);

module.exports = router;