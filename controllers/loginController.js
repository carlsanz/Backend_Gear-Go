const { sql, poolPromise } = require('../config/db');
// const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Usuarios WHERE email = @email');

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const user = result.recordset[0];

        // Compara la contraseña con la almacenada
        // const isMatch = await bcrypt.compare(password, user.contrasena);
        if (password !== user.contrasena) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        res.json({ message: 'Login exitoso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { login };
