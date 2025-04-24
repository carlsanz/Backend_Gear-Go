const { poolPromise, sql } = require('../config/db');

// Crear un nuevo alquiler
const crearAlquiler = async (req, res) => {
    try {
        const {
            id_herramienta,
            id_usuario,
            fecha_inicio,
            fecha_fin,
            total_dias,
            precio_total,
            estado = 'pendiente',
        } = req.body;

        const pool = await poolPromise;

        // Crear una tabla temporal para capturar el ID del alquiler
        const result = await pool.request()
            .input('id_herramienta', sql.Int, id_herramienta)
            .input('id_usuario', sql.Int, id_usuario)
            .input('fecha_inicio', sql.Date, fecha_inicio)
            .input('fecha_fin', sql.Date, fecha_fin)
            .input('total_dias', sql.Int, total_dias)
            .input('precio_total', sql.Decimal(10, 2), precio_total)
            .input('estado', sql.VarChar(50), estado)
            .query(`
                DECLARE @InsertedIds TABLE (id_alquiler INT);

                INSERT INTO Alquileres 
                (id_herramienta, id_usuario, fecha_inicio, fecha_fin, total_dias, precio_total, estado)
                OUTPUT INSERTED.id_alquiler INTO @InsertedIds
                VALUES (@id_herramienta, @id_usuario, @fecha_inicio, @fecha_fin, @total_dias, @precio_total, @estado);

                SELECT id_alquiler FROM @InsertedIds;
            `);

        const id_alquiler = result.recordset[0].id_alquiler;

        // Obtener el propietario de la herramienta
        const propietarioResult = await pool.request()
            .input('id_herramienta', sql.Int, id_herramienta)
            .query(`
                SELECT id_propietario as propietario_id
                FROM Herramientas
                WHERE id_herramienta = @id_herramienta
            `);

        const propietario_id = propietarioResult.recordset[0].propietario_id;

        // Crear la notificación para el propietario
        await pool.request()
            .input('alquiler_id', sql.Int, id_alquiler)
            .input('sender_id', sql.Int, id_usuario) // El cliente que solicita el alquiler
            .input('receiver_id', sql.Int, propietario_id) // El propietario de la herramienta
            .input('tipo_notificacion', sql.VarChar(60), 'solicitud')
            .input('contenido', sql.Text, `El usuario con ID ${id_usuario} ha solicitado alquilar tu herramienta.`)
            .input('estado', sql.VarChar(60), 'pendiente')
            .input('fecha', sql.DateTime, new Date())
            .query(`
                INSERT INTO Notificaciones 
                (alquiler_id, sender_id, receiver_id, tipo_notificacion, contenido, estado, fecha)
                VALUES (@alquiler_id, @sender_id, @receiver_id, @tipo_notificacion, @contenido, @estado, @fecha)
            `);

        res.status(200).json({ mensaje: 'Alquiler y notificación creados correctamente' });
    } catch (err) {
        console.error('Error al crear alquiler:', err);
        res.status(500).json({ mensaje: 'Error al crear alquiler' });
    }
};

// Obtener alquileres por id_usuario
const obtenerAlquileresPorUsuario = async (req, res) => {
    try {
        const pool = await poolPromise;
        const { id_usuario } = req.params;

        const result = await pool.request()
            .input('id_usuario', sql.Int, id_usuario)
            .query(`
                WITH ImagenesUnicas AS (
                    SELECT 
                        id_herramienta,
                        imagen,
                        ROW_NUMBER() OVER (PARTITION BY id_herramienta ORDER BY id_herramienta) AS row_num
                    FROM Imagenes_Herramientas
                )
                SELECT 
                    h.id_herramienta,
                    h.nombre AS Nombre,
                    h.marca AS Marca,
                    h.precio_por_dia,
                    a.fecha_inicio,
                    a.fecha_fin,
                    a.total_dias,
                    a.precio_total,
                    u.nombre AS propietario, -- Nombre del propietario de la herramienta
                    c.nombre AS cliente, -- Nombre del cliente que realizó el alquiler
                    CASE 
                        WHEN iu.imagen IS NOT NULL THEN REPLACE(iu.imagen, 'C:\\Users\\Liss Erazo\\Desktop\\Gear-Go Proyect\\Frontend_Gear-GO\\', '/assets/')
                        ELSE '/assets/placeholder.jpg'
                    END AS imagen
                FROM Alquileres a
                INNER JOIN Herramientas h ON a.id_herramienta = h.id_herramienta
                INNER JOIN Usuarios u ON h.id_propietario = u.id_usuario -- Relación con la tabla Usuarios (propietario)
                INNER JOIN Usuarios c ON a.id_usuario = c.id_usuario -- Relación con la tabla Usuarios (cliente)
                LEFT JOIN ImagenesUnicas iu ON h.id_herramienta = iu.id_herramienta AND iu.row_num = 1
                WHERE a.id_usuario = @id_usuario AND a.estado = 'Rentada';
            `);

        res.status(200).json({
            message: 'Alquileres obtenidos exitosamente',
            data: result.recordset
        });
    } catch (err) {
        console.error('Error al obtener alquileres por usuario:', err);
        res.status(500).json({ error: 'Error al obtener alquileres por usuario' });
    }
};

module.exports = {
    crearAlquiler,
    obtenerAlquileresPorUsuario
};
