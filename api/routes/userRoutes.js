const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { getAllUsers, getUserById, updateUser, deleteUser, addFavorite, deleteFavorite } = require('../controllers/userController');
const { Login, Register , google } = require('../controllers/authController');

// Sanitize and validate input for sensitive routes
router.route('/')
    .get(getAllUsers);

router.route('/:id')
    .get(
        param('id').isMongoId().withMessage('Invalid ID'), // Validate ID format
        getUserById
    )
    .put(
        param('id').isMongoId().withMessage('Invalid ID'), // Validate ID format
        updateUser
    )
    .delete(
        param('id').isMongoId().withMessage('Invalid ID'), // Validate ID format
        deleteUser
    );

router.route('/register')
    .post(Register);

router.route('/login')
    .post(Login);

router.route('/google')
    .post(google);

router.route('/:id/favorite/:favorite')
    .post(
        param('id').isMongoId().withMessage('Invalid ID'), // Validate ID format
        addFavorite
    )
    .delete(
        param('id').isMongoId().withMessage('Invalid ID'), // Validate ID format
        deleteFavorite
    );

module.exports = router;
