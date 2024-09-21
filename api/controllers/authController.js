const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

exports.Register = [
    // Validate and sanitize input fields
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).trim().escape(),
    body('firstName').not().isEmpty().trim().escape(),
    body('lastName').not().isEmpty().trim().escape(),
    body('phone').not().isEmpty().trim().escape(),

    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { firstName, lastName, email, password, phone, address } = req.body;

            // Check if the user already exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ status: 'failed', error: 'User already exists' });
            }

            // Create new user
            user = new User({
                firstName,
                lastName,
                email,
                password, // This will be hashed automatically due to the pre-save hook
                phone,
                address
            });

            await user.save();

            // Generate JWT Token
            const payload = {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(201).json({ token, currentUser: payload.user });
        } catch (error) {
            res.status(500).json({ status: 'failed', error: error.message });
        }
    }
];




exports.Login = [
    // Validate and sanitize input fields
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).trim().escape(),

    async (req, res) => {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;

            // Find the user based on sanitized email
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ status: 'failed', error: 'Wrong email or password' });
            }

            // Compare provided password with the stored hashed password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ status: 'failed', error: 'Wrong email or password' });
            }

            // Generate JWT Token
            const payload = {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    admin: user.admin
                }
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ token, currentUser: payload.user });
        } catch (error) {
            return res.status(500).json({ status: 'failed', error: error.message });
        }
    }
];