const express = require("express");
// const router = express.Router();

const User = require("../Models/User");

const bcrypt = require("bcrypt");

exports.register =  async (request, response) => {
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

        response.status(200).send({ message: "User created successfully",user: user });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};


exports.login =  async (request, response) => {
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

        response.status(200).send({ message: "User connected successfully",user: user  });
    }

    catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};

// module.exports = router;