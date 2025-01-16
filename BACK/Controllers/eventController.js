const Event = require("../Models/Event");
const User = require("../Models/User");

// Get all events
exports.getAllEvents = async (request, response) => {
    const userId = request.user._id;
    if (!userId) {
        return response.status(401).send('Access denied. No token provided.');
    }
    try {
        const user = await User.findOne({ _id: userId });
        if (!user)
            return response.status(400).send({ error: "User not found" });

        const events = await Event.find({ userId: userId })
            .populate({
                path: 'category',
                select: 'name color'
            });

        response.status(200).send({ message: "All events", events: events });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};

// Create a new event
exports.createEvent = async (request, response) => {
    const userId = request.user._id;
    if (!userId) {
        return response.status(401).send('Access denied. No token provided.');
    }
    const { title, start, end, location, description, color, category } = request.body;

    try {
        let user = await User.findOne({ _id: userId });
        if (!user)
            return response.status(400).send({ error: "User does not exist" });

        const eventStart = (start && start !== "") ? start : new Date().toISOString();

        const eventEnd = (end && end !== "" && new Date(end) > new Date(eventStart)) ? end : eventStart;

        const newEvent = {
            userId: userId,
            title: title,
            start: eventStart,
            end: eventEnd,
            location: location,
            description: description,
            color: color
        };

        if (category) {
            newEvent.category = category;
        }

        const savedEvent = new Event(newEvent);
        await savedEvent.save();
        response.status(200).send({ message: "Event created successfully", event: savedEvent });

    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};

// Update an existing event
exports.updateEvent = async (request, response) => {
    const userId = request.user._id;
    if (!userId) {
        return response.status(401).send('Access denied. No token provided.');
    }

    const id = request.params.id;
    const update = request.body;

    try {
        let user = await User.findOne({ _id: userId });
        if (!user)
            return response.status(404).send({ error: "User does not exist" });

        const event = await Event.findById(id);
        if (!event)
            return response.status(400).send({ error: "Event does not exist" });

        if (!update.start) {
            update.start = event.start;
        }

        if (!update.end || update.end === "" || new Date(update.end) < new Date(update.start)) {
            update.end = update.start;
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, update, { new: true });

        response.status(200).send({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};

// Delete an event
exports.deleteEvent = async (request, response) => {
    const userId = request.user._id;
    if (!userId) {
        return response.status(401).send('Access denied. No token provided.');
    }

    const id = request.params.id;

    try {
        let user = await User.findOne({ _id: userId });
        if (!user)
            return response.status(404).send({ error: "User does not exist" });
        const event = await Event.findByIdAndDelete(id);
        if (!event)
            return response.status(400).send({ error: "Event does not exist" });

        response.status(200).send({ message: "Event deleted successfully", event: event });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};
