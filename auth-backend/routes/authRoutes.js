const express = require('express');
// const { registerUser, loginUser } = require('../controllers/authController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/current-user', authController.getCurrentUser);

module.exports = router;
