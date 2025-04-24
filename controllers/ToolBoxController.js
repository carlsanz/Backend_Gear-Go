// controllers/ToolBoxController.js

const { sql, poolPromise } = require('../config/db'); 

const getToolBoxItems = async (req, res) => {
    try {
        const pool = await poolPromise;
        const { id_propietario } = req.params;

        const result = await pool.request()
            .input('id_propietario', sql.Int, id_propietario)
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
                    CASE 
                        WHEN iu.imagen IS NOT NULL THEN REPLACE(iu.imagen, 'C:\\Users\\Liss Erazo\\Desktop\\Gear-Go Proyect\\Frontend_Gear-GO\\', '/assets/')
                        ELSE '/assets/placeholder.jpg'
                    END AS imagen
                FROM Herramientas h
                LEFT JOIN ImagenesUnicas iu ON h.id_herramienta = iu.id_herramienta AND iu.row_num = 1
                WHERE h.id_propietario = @id_propietario;
            `);

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
            id_propietario, Nombre, descripcion, categoria,
            estado, precio_por_dia, Ubicacion, Disponible
        } = req.body;

        // Simulación de inserción
        const pool = await poolPromise;
        await pool.request()
            .input('id_propietario', sql.Int, id_propietario)
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

const getRentedTools = async (req, res) => {
    try {
        const pool = await poolPromise;
        const { id_propietario } = req.params;

        const result = await pool.request()
            .input('id_propietario', sql.Int, id_propietario)
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
                    u.nombre AS cliente, -- Trae el nombre del cliente desde la tabla Usuarios
                    CASE 
                        WHEN iu.imagen IS NOT NULL THEN REPLACE(iu.imagen, 'C:\\Users\\Liss Erazo\\Desktop\\Gear-Go Proyect\\Frontend_Gear-GO\\', '/assets/')
                        ELSE '/assets/placeholder.jpg'
                    END AS imagen
                FROM Herramientas h
                INNER JOIN Alquileres a ON h.id_herramienta = a.id_herramienta
                INNER JOIN Usuarios u ON a.id_usuario = u.id_usuario -- Relación con la tabla Usuarios
                LEFT JOIN ImagenesUnicas iu ON h.id_herramienta = iu.id_herramienta AND iu.row_num = 1
                WHERE h.id_propietario = @id_propietario AND a.estado = 'Rentada';
            `);

        res.status(200).json({
            message: 'Herramientas en renta obtenidas exitosamente',
            data: result.recordset
        });
    } catch (err) {
        console.error('Error al obtener herramientas en renta:', err);
        res.status(500).json({ error: 'Error al obtener herramientas en renta' });
    }
};

module.exports = {
    getToolBoxItems,
    createToolBoxItem,
    getRentedTools
};
