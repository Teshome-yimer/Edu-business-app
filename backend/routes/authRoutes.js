const express = require('express');
const { body } = require('express-validator');
const {
    register,
    login,
    logout,
    getMe,
    updateDetails
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const registerValidation = [
    body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
    body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
    body('role')
    .optional()
    .isIn(['student', 'tutor', 'admin'])
    .withMessage('Role must be student, tutor, or admin')
];

const loginValidation = [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
    body('password')
    .notEmpty()
    .withMessage('Password is required')
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);

module.exports = router;