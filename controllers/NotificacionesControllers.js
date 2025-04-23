const { poolPromise, sql } = require('../config/db');

// Crear una nueva notificación
const crearNotificacion = async (req, res) => {
    try {
        const {
            id_usuario,
            id_tipo_notificacion,
            mensaje
        } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input('id_usuario', sql.Int, id_usuario)
            .input('id_tipo_notificacion', sql.Int, id_tipo_notificacion)
            .input('mensaje', sql.VarChar(sql.MAX), mensaje)
            .input('leida', sql.Bit, 0)
            .input('fecha_envio', sql.DateTime, new Date())
            .query(`
                INSERT INTO Notificaciones 
                (id_usuario, id_tipo_notificacion, mensaje, leida, fecha_envio)
                VALUES (@id_usuario, @id_tipo_notificacion, @mensaje, @leida, @fecha_envio)
            `);

        res.status(200).json({ mensaje: 'Notificación creada correctamente' });
    } catch (err) {
        console.error('Error al crear notificación:', err);
        res.status(500).json({ mensaje: 'Error al crear notificación' });
    }
};

// Obtener notificaciones por usuario
const obtenerNotificacionesPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('id_usuario', sql.Int, id_usuario)
            .query(`
                SELECT * FROM Notificaciones 
                WHERE id_usuario = @id_usuario 
                ORDER BY fecha_envio DESC
            `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error al obtener notificaciones:', err);
        res.status(500).json({ mensaje: 'Error al obtener notificaciones' });
    }
};

// Marcar notificación como leída
const marcarComoLeida = async (req, res) => {
    try {
        const { id_notificacion } = req.params;
        const pool = await poolPromise;

        await pool.request()
            .input('id_notificacion', sql.Int, id_notificacion)
            .query(`
                UPDATE Notificaciones SET leida = 1 
                WHERE id_notificacion = @id_notificacion
            `);

        res.status(200).json({ mensaje: 'Notificación marcada como leída' });
    } catch (err) {
        console.error('Error al marcar como leída:', err);
        res.status(500).json({ mensaje: 'Error al actualizar notificación' });
    }
};

module.exports = {
    crearNotificacion,
    obtenerNotificacionesPorUsuario,
    marcarComoLeida
};
