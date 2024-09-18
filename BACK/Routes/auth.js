const express = require("express");
const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");

router.post("/register", async (request, response) => {
    const {name, email, password } = request.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return response.status(400).send({ error: "User already exist" });
        }
        user = new User({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        console.log("User saved successfully");

        response.status(200).send({ user: user, message: "User created successfully" });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
});


router.post("/login", async (request, response) => {
    const { email, password } = request.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return response.status(400).send({ error: "User does not exist" });
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response.status(405).send({ error: "Wrong Password" });
        }

        response.status(200).send({ user: user, message: "User connected successfully" });
    }

    catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
});

module.exports = router;