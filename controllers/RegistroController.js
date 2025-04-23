const { sql, poolPromise } = require('../config/db');

const crearUsuario = async (req, res) => {
    try {
        const {
            Nombre,
            email,
            contrasena,
            telefono,
            Direccion,
            id_tipo_identificacion,
            identificacion
        } = req.body;

        const pool = await poolPromise;

        // Verificar si ya existe la identidad o el teléfono
        const checkExistence = await pool.request()
            .input('telefono', sql.VarChar, telefono)
            .input('identificacion', sql.VarChar, identificacion)
            .query(`
                SELECT * FROM Usuarios 
                WHERE telefono = @telefono OR identificacion = @identificacion
            `);

        if (checkExistence.recordset.length > 0) {
            console.log('Identidad o teléfono ya registrados:', checkExistence.recordset);
            return res.status(400).json({ 
                message: 'Ya existe un usuario con esa identidad o teléfono',
                data: checkExistence.recordset
            });
        }

        // Si no existe, proceder con la inserción
        await pool.request()
            .input('Nombre', sql.VarChar, Nombre)
            .input('email', sql.VarChar, email)
            .input('contrasena', sql.VarChar, contrasena)
            .input('telefono', sql.VarChar, telefono)
            .input('Direccion', sql.VarChar, Direccion)
            .input('id_tipo_identificacion', sql.Int, id_tipo_identificacion)
            .input('identificacion', sql.VarChar, identificacion)
            .input('fecha_de_registro', sql.DateTime, new Date())
            .input('aceptada', sql.Bit, 0)
            .query(`
                INSERT INTO Usuarios (
                    Nombre, email, contrasena, telefono, Direccion,
                    id_tipo_identificacion, identificacion, fecha_de_registro, aceptada
                )
                VALUES (
                    @Nombre, @email, @contrasena, @telefono, @Direccion,
                    @id_tipo_identificacion, @identificacion, @fecha_de_registro, @aceptada
                )
            `);

        res.status(201).json({ message: 'Usuario creado correctamente' });

    } catch (err) {
        console.error('Error al crear usuario:', err);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

module.exports = { crearUsuario };
