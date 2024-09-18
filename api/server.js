const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const helmet = require('helmet');
const { OAuth2Client } = require('google-auth-library'); // Import Google OAuth2Client
const User = require('./models/User'); // Import User model

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const genreRoutes = require('./routes/genreRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const commentRoutes = require('./routes/commentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reportRoutes = require('./routes/reportRoutes');
const imageRoutes = require('./routes/imageRoutes');
const miniImageRoutes = require('./routes/miniImageRoutes');

const app = express();
const port = process.env.PORT || 4000;

// Initialize Google OAuth2 Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// MIDDLEWARES

app.use(helmet());  // Adding Helmet for security headers
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "trusteddomain.com"], // Example of trusted domain for scripts
            objectSrc: ["'none'"], // Disallow object embeds
            imgSrc: ["'self'", "data:"], // Allow images from the same origin and data URIs
            upgradeInsecureRequests: [],
        },
    })
);

const corsOptions = {
    origin: ['http://localhost:3000'], // accepting requests from trusted origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());

// ROUTES
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/genres', genreRoutes);
app.use('/products', productRoutes);
app.use('/ratings', ratingRoutes);
app.use('/comments', commentRoutes);
app.use('/orders', orderRoutes);
app.use('/reports', reportRoutes);
app.use('/images', imageRoutes);
app.use('/minis', miniImageRoutes);

// GOOGLE AUTHENTICATION ROUTE
app.post('/auth/google', async (req, res) => {
    const { token } = req.body;
    console.log('Received token:', token); // Log the token received

    try {
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        // Check if user exists
        let user = await User.findOne({ email: payload.email });
        if (!user) {
            // Create new user
            user = new User({
                email: payload.email,
                firstName: payload.given_name || '',
                lastName: payload.family_name || '',
                googleId: payload.sub, // Google's unique user ID
                name: payload.name,
            });
            await user.save();
        }

        // Return user info
        res.status(201).json({ currentUser: user });
    } catch (error) {
        console.error('Error verifying Google token:', error.stack);
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
});

// STRIPE CONNECTION
app.post("/create-payment-intent", async (req, res) => {
    const { price } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(price),
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.status(200).send({
        clientSecret: paymentIntent.client_secret,
    });
});

mongoose.connect(process.env.MONGODB_URL, () => {
    console.log('Successfully connected to database.');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});