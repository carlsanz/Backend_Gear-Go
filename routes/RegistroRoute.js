const express = require('express');
const router = express.Router();
const { crearUsuario } = require('../controllers/RegistroController');

router.post('/crear', crearUsuario);

module.exports = router;