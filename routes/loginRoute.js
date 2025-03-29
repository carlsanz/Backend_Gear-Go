const express = require('express');
const router = express.Router();
const { login } = require('../controllers/loginController');
const cors = require('cors')

const app = express();

app.use(cors());



router.post('/user', login);


module.exports = router;