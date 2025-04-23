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
            estado
        } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input('id_herramienta', sql.Int, id_herramienta)
            .input('id_usuario', sql.Int, id_usuario)
            .input('fecha_inicio', sql.Date, fecha_inicio)
            .input('fecha_fin', sql.Date, fecha_fin)
            .input('total_dias', sql.Int, total_dias)
            .input('precio_total', sql.Decimal(10, 2), precio_total)
            .input('estado', sql.VarChar(50), estado)
            .query(`
                INSERT INTO Alquileres 
                (id_herramienta, id_usuario, fecha_inicio, fecha_fin, total_dias, precio_total, estado)
                VALUES (@id_herramienta, @id_usuario, @fecha_inicio, @fecha_fin, @total_dias, @precio_total, @estado)
            `);

        res.status(200).json({ mensaje: 'Alquiler creado exitosamente' });
    } catch (err) {
        console.error('Error al crear alquiler:', err);
        res.status(500).json({ mensaje: 'Error al crear alquiler' });
    }
};

// Obtener alquileres por id_usuario
const obtenerAlquileresPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('id_usuario', sql.Int, id_usuario)
            .query('SELECT TOP 10 * FROM Alquileres WHERE id_usuario = @id_usuario ORDER BY fecha_inicio DESC');

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error al obtener alquileres:', err);
        res.status(500).json({ mensaje: 'Error al obtener alquileres' });
    }
};

module.exports = {
    crearAlquiler,
    obtenerAlquileresPorUsuario
};
