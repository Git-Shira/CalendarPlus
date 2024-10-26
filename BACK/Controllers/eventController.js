const express = require("express");
// const router = express.Router();

const User = require("../Models/User");
const Event = require("../Models/Event");

exports.createEvent = async (request, response) => {
    const { userId, title, start, end, location, description, color } = request.body;

    try {
        let user = await User.findOne({ _id: userId });
        if (!user)
            return response.status(400).send({ error: "User does not exist" });

        const newEvent = new Event({
            userId: userId,
            title: title,
            start: start,
            end: end,
            location: location,
            description: description,
            color: color
        });

        await newEvent.save();

        response.status(200).send({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};

exports.updateEvent = async (request, response) => {
    const id = request.params.id;
    const update = request.body;

    try {
        const event = await Event.findByIdAndUpdate(id, update);
        if (!event)
            return response.status(400).send({ error: "Event does not exist" });

        response.status(200).send({ message: "Event updated successfully", event: event });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};

exports.deleteEvent = async (request, response) => {
    const id = request.params.id;

    try {
        const event = await Event.findByIdAndDelete(id);
        if (!event)
            return response.status(400).send({ error: "Event does not exist" });

        response.status(200).send({ message: "Event deleted successfully", event: event });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};

exports.getAllEvents = async (request, response) => {
    const id = request.params.id;

    try {
        const user = await User.findOne({ _id: id });
        if (!user)
            return response.status(400).send({ error: "User does not exist" });

        const events = await Event.find({ userId: id });
        response.status(200).send({ message: "All events", events: events });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};

// module.exports = router;