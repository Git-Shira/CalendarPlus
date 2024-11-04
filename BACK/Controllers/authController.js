const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


// Register a new user
exports.register = async (request, response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
        return response.status(400).send({ error: 'name, email, and password are required.' });
    }

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

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const httpOnly = process.env.HTTP_ONLY === 'true';

        response.cookie('authToken', token, {
            httpOnly: httpOnly,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        response.status(200).send({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};

// Login a user
exports.login = async (request, response) => {
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

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const httpOnly = process.env.HTTP_ONLY === 'true';

        response.cookie('authToken', token, {
            httpOnly: httpOnly,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        response.status(200).send({ message: "User connected successfully" });
    }

    catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};

// Logout a user
exports.logout = (request, response) => {
    response.clearCookie('authToken').status(200).send({ message: "Logged out successfully" });
};