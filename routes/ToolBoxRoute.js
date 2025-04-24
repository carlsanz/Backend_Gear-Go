// routes/ToolBoxRoute.js

const express = require('express');
const router = express.Router();
const { getToolBoxItems, createToolBoxItem, getRentedTools } = require('../controllers/ToolBoxController');

// Ruta para obtener herramientas disponibles
router.get('/:id_propietario', getToolBoxItems);

// Ruta para obtener herramientas en renta
router.get('/renta/:id_propietario', getRentedTools);

// Ruta para crear una herramienta
router.post('/crear', createToolBoxItem);

module.exports = router;