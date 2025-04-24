const { sql, poolPromise } = require('../config/db');

const registrarPagoTarjeta = async (req, res) => {
  const { id_pago, numero_tarjeta, nombre_titular, fecha_expiracion, cvv } = req.body;

  try {
    const pool = await poolPromise;

    await pool.request()
      .input('id_pago', sql.Int, id_pago)
      .input('Numero_tarjeta', sql.VarChar, numero_tarjeta)
      .input('Nombre_titular', sql.VarChar, nombre_titular)
      .input('Fecha_expiracion', sql.VarChar, fecha_expiracion)
      .input('cvv', sql.VarChar, cvv)
      .query(`
        INSERT INTO PagosTarjeta (id_pago, Numero_tarjeta, Nombre_titular, Fecha_expiracion, cvv)
        VALUES (@id_pago, @Numero_tarjeta, @Nombre_titular, @Fecha_expiracion, @cvv)
      `);

    res.status(201).json({ mensaje: 'Pago con tarjeta registrado correctamente.' });
  } catch (error) {
    console.error('Error al registrar pago con tarjeta:', error);
    res.status(500).json({ error: 'Error al registrar el pago con tarjeta.' });
  }
};

module.exports = {
  registrarPagoTarjeta
};
