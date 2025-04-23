// controllers/ToolBoxController.js

const { sql, poolPromise } = require('../config/db'); 


const getToolBoxItems = async (req, res) => {
    try {
        const pool = await poolPromise;
        const { id_usuario } = req.params;

        const result = await pool.request()

            .input('id_usuario', sql.Int, id_usuario)
            .query('SELECT * FROM Herramientas WHERE id_usuario = @id_usuario');

            
        res.status(200).json({
            message: 'Herramientas obtenidas exitosamente',
            data: result.recordset
        });
    } catch (err) {
        console.error('Error al obtener herramientas:', err);
        res.status(500).json({ error: 'Error al obtener herramientas' });
    }
};


const createToolBoxItem = async (req, res) => {
    try {
        const {
            id_usuario, Nombre, descripcion, categoria,
            estado, precio_por_dia, Ubicacion, Disponible
        } = req.body;

        // Simulación de inserción
        const pool = await poolPromise;
        await pool.request()
            .input('id_usuario', sql.Int, id_usuario)
            .input('Nombre', sql.VarChar(100), Nombre)
            .input('descripcion', sql.VarChar(500), descripcion)
            .input('categoria', sql.VarChar(100), categoria)
            .input('estado', sql.VarChar(50), estado)
            .input('precio_por_dia', sql.Decimal(10, 2), precio_por_dia)
            .input('Ubicacion', sql.VarChar(150), Ubicacion)
            .input('Disponible', sql.Bit, Disponible)
            .query(`INSERT INTO Herramientas (
                        id_usuario, Nombre, descripcion, categoria,
                        estado, precio_por_dia, Ubicacion, Disponible,
                        fecha_publicacion, Aceptada
                    )
                    VALUES (
                        @id_usuario, @Nombre, @descripcion, @categoria,
                        @estado, @precio_por_dia, @Ubicacion, @Disponible,
                        GETDATE(), 0)`); // Insert con valores por defecto

        res.status(201).json({ message: 'Herramienta creada correctamente (prueba)' });
    } catch (err) {
        console.error('Error al crear herramienta:', err);
        res.status(500).json({ error: 'Error al crear herramienta' });
    }
};

module.exports = {
    getToolBoxItems,
    createToolBoxItem
};
