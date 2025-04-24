const express = require('express');
const router = express.Router();
const PagosController = require('../controllers/PagosControllers');

router.post('/', PagosController.crearPago);
router.get('/', PagosController.obtenerPagos);
router.get('/usuario/:id_usuario', PagosController.obtenerPagosPorUsuario);

module.exports = router;