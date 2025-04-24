const { poolPromise, sql } = require('../config/db');

// Crear una nueva notificación
const crearNotificacion = async (req, res) => {
    try {
        console.log('Datos recibidos en el backend:', req.body); // Verifica los datos recibidos

        const { alquiler_id, sender_id, receiver_id, tipo_notificacion, contenido, estado } = req.body;

        const pool = await poolPromise; // Obtén el objeto pool desde poolPromise

        await pool.request()
            .input('alquiler_id', sql.Int, alquiler_id)
            .input('sender_id', sql.Int, sender_id)
            .input('receiver_id', sql.Int, receiver_id)
            .input('tipo_notificacion', sql.VarChar(60), tipo_notificacion)
            .input('contenido', sql.Text, contenido)
            .input('estado', sql.VarChar(60), estado)
            .input('fecha', sql.DateTime, new Date())
            .query(`
                INSERT INTO Notificaciones 
                (alquiler_id, sender_id, receiver_id, tipo_notificacion, contenido, estado, fecha)
                VALUES (@alquiler_id, @sender_id, @receiver_id, @tipo_notificacion, @contenido, @estado, @fecha)
            `);

        res.status(200).json({ mensaje: 'Notificación creada correctamente' });
    } catch (err) {
        console.error('Error al crear notificación:', err);
        res.status(500).json({ mensaje: 'Error al crear notificación' });
    }
};

// Obtener notificaciones por usuario (receiver_id)
const obtenerNotificacionesPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params; // Obtén el ID del usuario logueado desde los parámetros
        const pool = await poolPromise;

        const result = await pool.request()
            .input('id_usuario', sql.Int, id_usuario)
            .query(`
                SELECT 
                    n.id_notificacion AS id,
                    n.tipo_notificacion AS type,
                    n.contenido AS message,
                    n.fecha AS createdAt,
                    n.estado AS status,
                    u.nombre AS sender, 
                    h.nombre AS toolName, 
                    a.total_dias AS totalDays, 
                    a.precio_total AS totalPrice 
                FROM Notificaciones n
                INNER JOIN Usuarios u ON n.sender_id = u.id_usuario 
                LEFT JOIN Alquileres a ON n.alquiler_id = a.id_alquiler 
                LEFT JOIN Herramientas h ON a.id_herramienta = h.id_herramienta 
                WHERE n.receiver_id = @id_usuario 
                ORDER BY n.fecha DESC;
            `);

        res.status(200).json({
            message: 'Notificaciones obtenidas exitosamente',
            data: result.recordset
        });
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ error: 'Error al obtener notificaciones' });
    }
};

// Marcar notificación como leída (actualizar estado)
const marcarComoLeida = async (req, res) => {
    try {
        const { id_notificacion } = req.params;
        const pool = await poolPromise;

        await pool.request()
            .input('id_notificacion', sql.Int, id_notificacion)
            .query(`
                UPDATE Notificaciones 
                SET estado = 'leída' 
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
