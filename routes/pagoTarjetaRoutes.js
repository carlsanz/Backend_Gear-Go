const express = require('express');
const router = express.Router();
const { registrarPagoTarjeta } = require('../controllers/pagoTarjetaController');

router.post('/', registrarPagoTarjeta);

module.exports = router;
