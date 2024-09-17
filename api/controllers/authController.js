const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { body, validationResult } = require('express-validator'); // Validation middleware

exports.Register = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({
            newUser
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            error
        });
    }
};

// Add input validation and sanitization in Login function
exports.Login = [
    body('email').isEmail().normalizeEmail(), // Validate email format
    body('password').isLength({ min: 6 }).trim().escape(), // Validate and sanitize password

    async (req, res) => {
        // Handle validation result
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findOne({ email: req.body.email }).lean(); // .lean() for performance
            if (!user) {
                return res.status(400).json({ status: 'failed', error: 'Wrong email or password' });
            }

            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (isMatch) {
                return res.status(200).json({ currentUser: user });
            } else {
                return res.status(400).json({ status: 'failed', error: 'Wrong email or password' });
            }
        } catch (error) {
            return res.status(500).json({ status: 'failed', error });
        }
    }
];
