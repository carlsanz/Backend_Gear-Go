const { sql, poolPromise } = require('../config/db');

const getHerramientas = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT 
                    H.id_herramienta,
                    H.Nombre,
                    H.Marca,
                    H.descripcion,
                    H.precio_por_dia,
                    IH.imagen, 
                    H.id_propietario,
					U.Nombre AS Propietario
                FROM 
                    Herramientas H
                LEFT JOIN (
                    SELECT 
                        id_herramienta, 
                        imagen,
                        ROW_NUMBER() OVER (PARTITION BY id_herramienta ORDER BY id_imagen ASC) AS row_num
                    FROM Imagenes_Herramientas
                ) IH ON H.id_herramienta = IH.id_herramienta AND IH.row_num = 1
				LEFT JOIN (SELECT 
				id_usuario, Nombre FROM Usuarios) U ON H.id_propietario= U.id_usuario
            `);

        const herramientas = result.recordset.map((herramienta) => ({
            ...herramienta,
            image: herramienta.imagen ? `http://192.168.1.10:5000${herramienta.imagen}` : null, // Agrega el dominio base
        }));
        res.json(herramientas);
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { getHerramientas };