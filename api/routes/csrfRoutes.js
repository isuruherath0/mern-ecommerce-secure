const express = require('express');
const csrf = require('csurf');  // CSRF protection middleware
const cookieParser = require('cookie-parser');

const router = express.Router();

// Setup CSRF protection using 'cookie' as the storage mechanism
const csrfProtection = csrf({ cookie: true });

// Use cookie-parser to parse cookies
router.use(cookieParser());

// Define the route to get the CSRF token
router.get('/', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

module.exports = router;
