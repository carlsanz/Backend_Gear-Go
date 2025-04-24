const { sql, poolPromise } = require('../config/db');
// const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { email, contrasena } = req.body;

    try {
        const pool = await poolPromise; // Obtén la conexión al pool
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .input('contrasena', sql.VarChar, contrasena)
            .query(`
                SELECT id_usuario AS id, Nombre AS name, email
                FROM Usuarios
                WHERE email = @email AND contrasena = @contrasena
            `);

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]); // Devuelve el usuario encontrado
        } else {
            res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

module.exports = { login };
