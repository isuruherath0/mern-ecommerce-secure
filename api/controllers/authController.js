const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Register function with input validation and sanitization
exports.Register = [
    // Validate and sanitize input fields
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).trim().escape(),
    body('name').not().isEmpty().trim().escape(),

    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Manually extract only the required fields from req.body
            const { name, email, password } = req.body;

            // Hash the password before storing
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user securely
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword
            });

            res.status(201).json({ newUser });
        } catch (error) {
            res.status(500).json({ status: 'failed', error: error.message });
        }
    }
];

// Login function with validation and sanitization
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
            // Find the user based on sanitized email
            const user = await User.findOne({ email: req.body.email }).lean();

            if (!user) {
                return res.status(400).json({ status: 'failed', error: 'Wrong email or password' });
            }

            // Compare provided password with the stored hashed password
            const isMatch = await bcrypt.compare(req.body.password, user.password);

            if (isMatch) {
                return res.status(200).json({ currentUser: user });
            } else {
                return res.status(400).json({ status: 'failed', error: 'Wrong email or password' });
            }
        } catch (error) {
            return res.status(500).json({ status: 'failed', error: error.message });
        }
    }
];

exports.google = async (req, res) => {

    const { email, name } = req.body;
    try {
        const user = await User.findOne({ email }).lean();
        if (!user) {
            const generatedPassword = Math.random().toString(36).slice(-8); // Generate a random password

            const hashedPassword = await bcrypt.hash(generatedPassword, 10);


            const newUser = await User.create({
                firstName: name,
                email,
                password: hashedPassword,
                lastName: "Doe",
                phone: "1244567890",
                address: "123 Main St"
            });

            res.status(201).json({ newUser });
        }

        return res.status(200).json({ currentUser: user });
    } catch (error) {
        res.status(500).json({ status: 'failed', error: error.message });
    }
}
