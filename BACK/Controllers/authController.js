const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const crypto = require("crypto");

const nodemailer = require("nodemailer");

const Category = require("../Models/Category");
const Event = require("../Models/Event");
const User = require("../Models/User");

// Get user profile
exports.profile = async (request, response) => {
    const userId = request.user._id;
    if (!userId) {
        return response.status(400).send({ error: 'Access denied. No token provided.' });
    }

    try {
        const user = await User.findOne({ _id: userId }).select('-password');
        if (!user)
            return response.status(401).send({ error: "User not found." });

        response.status(200).send({ message: 'User profile retrieved successfully', user: user });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};

// Register a new user
exports.register = async (request, response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
        return response.status(401).send({ error: 'name, email, and password are required.' });
    }

    try {
        let user = await User.findOne({ email: email });

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

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const httpOnly = process.env.HTTP_ONLY === 'true';

        const tokenExpiresInMilliseconds = 7 * 24 * 60 * 60 * 1000;

        response.cookie('authToken', token, {
            httpOnly: httpOnly,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: tokenExpiresInMilliseconds
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
        let user = await User.findOne({ email: email });

        if (!user) {
            return response.status(400).send({ error: "User does not exist" });
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response.status(405).send({ error: "Wrong Password" });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const httpOnly = process.env.HTTP_ONLY === 'true';

        const tokenExpiresInMilliseconds = 7 * 24 * 60 * 60 * 1000;

        response.cookie('authToken', token, {
            httpOnly: httpOnly,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: tokenExpiresInMilliseconds
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

// Update user profile
exports.update = async (request, response) => {
    const userId = request.user._id;
    if (!userId) {
        return response.status(401).send({ error: 'Access denied. No token provided.' });
    }

    const { name, email, password } = request.body;

    try {
        const user = await User.findOne({ _id: userId });
        if (!user)
            return response.status(400).send({ error: "User not found." });

        if (email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return response.status(402).send({ error: 'Email already registered.' });
            }
            user.email = email;
        }
        if (name) {
            user.name = name;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        response.send('User updated successfully.');

    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }

};

// Forgot Password - Send Reset Code
exports.forgotPassword = async (request, response) => {
    const { email } = request.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(400).send({ error: "User not found" });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        const encryptedCode = crypto.createHash("sha256").update(resetCode).digest("hex");

        user.resetPasswordCode = encryptedCode;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset Request",
            text: `Hey ${user.name},\n\n` +
                `We received a request to change your password on Calendar Plus.\n` +
                `Please enter the one-time code below on the reset page to continue:\n\n` +
                `${resetCode}\n\n` +
                `The code will expire in 15 minutes.\n\n` +
                `Best regards,\n` +
                `Your friends at Calendar Plus`,
            html: `
                    <html>
                        <head>
                            <style>
                                .body {
                                font-family: 'Arial', sans-serif !important; 
                                    color: #006d77 !important; 
                                    font-weight: bold !important; 
                                    font-size: 16px !important; 
                                    line-height: 1.6;
                                    text-align: center; 
                                    margin: 0;
                                    padding: 0;
                                }
                            
                                .code {
                                    font-size: 24px; 
                                    color: #006d77;
                                    text-align: center;
                                }

                                .calendar-plus {
                                    font-size: 18px; 
                                    font-style: italic; 
                                    font-weight: bold; 
                                    color: #006d77;
                                }

                                .underline {
                                    text-decoration: underline;
                                    text-decoration-color: #006d77;
                                }

                            </style>
                        </head>
                        <body>
                            <p class="body">Hey ${user.name},</p>
                            <br/>
                            <p class="body">We received a request to change your password on 
                                <span class="calendar-plus">Calendar Plus</span>.
                            </p>
                            <p class="body">Please enter the one-time code below on the reset page to continue:</p>
                            <h1 class="code">${resetCode}</h1>
                            <p class="body">The code will expire in 
                                <span class="underline">15 minutes</span>.
                            </p>
                            <br/>
                            <p class="body">Best regards,<br>
                                Your friends at 
                                <span class="calendar-plus">Calendar Plus</span>
                            </p>
                        </body>
                    </html>
                `,
        };

        await transporter.sendMail(mailOptions);

        response.status(200).send({ message: "Reset code sent successfully" });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};

// Verify Code
exports.verifyCode = async (request, response) => {
    const { code } = request.body;

    try {
        const encryptedCode = crypto.createHash("sha256").update(code).digest("hex");
        const user = await User.findOne({ resetPasswordCode: encryptedCode });

        if (!user || user.resetPasswordExpires < Date.now()) {
            return response.status(400).send({ error: "Invalid or expired code" });
        }

        response.status(200).send({ message: "Code verified successfully" });
    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};

// Reset Password
exports.resetPassword = async (request, response) => {
    const { resetCode, newPassword } = request.body;

    console.log('Request Body:', request.body);
    console.log('Reset Code:', resetCode);
    console.log('New Password:', newPassword);

    try {
        if (!resetCode || !newPassword) {
            return response.status(400).json({ message: 'Reset code and new password are required.' });
        }

        const encryptedCode = crypto.createHash('sha256').update(resetCode).digest('hex');

        const user = await User.findOne({ resetPasswordCode: encryptedCode });

        if (!user || user.resetPasswordExpires < Date.now()) {
            return response.status(404).json({ message: 'Invalid or expired reset code.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        user.resetPasswordCode = null;
        user.resetPasswordExpires = null;
        await user.save();

        response.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        response.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a user
exports.delete = async (request, response) => {
    const userId = request.user._id;
    if (!userId) {
        return response.status(401).send({ error: 'Access denied. No token provided.' });
    }

    try {
        const user = await User.findByIdAndDelete({ _id: userId });
        if (!user)
            return response.status(400).send({ error: "User not found." });

        await Category.deleteMany({ userId });

        await Event.deleteMany({ userId });

        response.status(200).send({ message: 'User and associated categories and events deleted successfully.' });

    } catch (error) {
        console.error(error);
        response.status(500).send({ error: "Something went wrong" });
    }
};