const express = require('express');
const router = express.Router();
const {
    crearAlquiler,
    obtenerAlquileresPorUsuario
} = require('../controllers/AlquileresControllers');

// Ruta para crear un alquiler
router.post('/nuevo', crearAlquiler);

// Ruta para obtener alquileres por usuario
router.get('/:id_usuario', obtenerAlquileresPorUsuario);

module.exports = router;
