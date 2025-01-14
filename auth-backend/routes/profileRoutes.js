const express = require('express');
const auth = require('../middlewares/auth');
const profileController = require('../controllers/profileController');
const router = express.Router();

router.get('/profile/:id', auth, profileController.getProfile);

module.exports = router;
