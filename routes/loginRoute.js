const express = require('express');
const router = express.Router();
const { login } = require('../controllers/loginController');



router.post('/user', login);

module.exports = router;