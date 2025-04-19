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
                    IH.imagen 
                FROM 
                    Herramientas H
                LEFT JOIN (
                    SELECT 
                        id_herramienta, 
                        imagen,
                        ROW_NUMBER() OVER (PARTITION BY id_herramienta ORDER BY id_imagen ASC) AS row_num
                    FROM Imagenes_Herramientas
                ) IH ON H.id_herramienta = IH.id_herramienta AND IH.row_num = 1
            `);

        const herramientas = result.recordset.map((herramienta) => ({
            ...herramienta,
            image: herramienta.imagen ? `http://192.168.43.26:5000${herramienta.imagen}` : null, // Agrega el dominio base
        }));
        res.json(herramientas);
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { getHerramientas };