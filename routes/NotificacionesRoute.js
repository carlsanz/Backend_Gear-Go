const express = require('express');
const router = express.Router();
const {
    crearNotificacion,
    obtenerNotificacionesPorUsuario,
    marcarComoLeida
} = require('../controllers/NotificacionesControllers');

// Crear una notificación
router.post('/crear', crearNotificacion);

// Obtener notificaciones por usuario
router.get('/:id_usuario', obtenerNotificacionesPorUsuario);

// Marcar como leída
router.put('/leida/:id_notificacion', marcarComoLeida);

module.exports = router;
