const { poolPromise, sql } = require('../config/db');

const crearPago = async (req, res) => {
    try {
        const { id_alquiler, id_usuario, monto, metodo_de_pago, estado_pago, fecha_pago } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input('id_alquiler', sql.Int, id_alquiler)
            .input('id_usuario', sql.Int, id_usuario)
            .input('monto', sql.Decimal(10, 2), monto)
            .input('metodo_de_pago', sql.VarChar, metodo_de_pago)
            .input('estado_pago', sql.VarChar, estado_pago)
            .input('fecha_pago', sql.DateTime, fecha_pago)
            .query(`INSERT INTO Pagos (id_alquiler, id_usuario, monto, metodo_de_pago, estado_pago, fecha_pago)
                    VALUES (@id_alquiler, @id_usuario, @monto, @metodo_de_pago, @estado_pago, @fecha_pago)`);
        res.status(201).json({ mensaje: 'Pago registrado correctamente' });
    } catch (err) {
        console.error('Error al registrar pago:', err);
        res.status(500).json({ error: 'Error al registrar pago' });
    }
};

const obtenerPagos = async (req, res) => {
    try {
        const pool = await poolPromise;
        const resultado = await pool.request().query('SELECT TOP 10 * FROM Pagos');
        res.json(resultado.recordset);
    } catch (err) {
        console.error('Error al obtener pagos:', err);
        res.status(500).json({ error: 'Error al obtener pagos' });
    }
};

const obtenerPagosPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const pool = await poolPromise;
        const resultado = await pool.request()
            .input('id_usuario', sql.Int, id_usuario)
            .query('SELECT * FROM Pagos WHERE id_usuario = @id_usuario');
        res.json(resultado.recordset);
    } catch (err) {
        console.error('Error al obtener pagos del usuario:', err);
        res.status(500).json({ error: 'Error al obtener pagos del usuario' });
    }
};

module.exports = {
    crearPago,
    obtenerPagos,
    obtenerPagosPorUsuario
};
