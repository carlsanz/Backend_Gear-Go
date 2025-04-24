const { json } = require('express');
const { sql, poolPromise } = require('../config/db');

const getHerramientasAdmin = async (req, res) => {
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
                 WHERE H.Aceptada = 0
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

const updateHerramienta = async (req, res) => {
    const {id_herramienta} = req.params;

    try{
        const pool = await poolPromise;
        await pool.request()
            .input('id_herramienta', sql.Int, id_herramienta)
            .query(`
                UPDATE Herramientas
                SET Aceptada = 1
                WHERE id_herramienta = @id_herramienta
                `);

        res.status(200).json({message: 'Herramienta aprobada correctamente'});
    }catch(error){
        console.error('Error al actualizar herramienta: ', error);
        res.status(500),json({message: 'Error en el servidor'});
    }
};

const eliminarHerramienta = async (req, res) =>{
    const {id_herramienta} = req.params;
    try{
        const pool = await poolPromise;

        await pool.request()
            .input('id_herramienta', sql.Int, id_herramienta)
            .query(`
                DELETE FROM Alquileres WHERE id_herramienta = @id_herramienta
                `)
        await pool.request()
            .input('id_herramienta', sql.Int, id_herramienta)
            .query(`
                DELETE FROM Imagenes_Herramientas WHERE id_herramienta = @id_herramienta
                DELETE FROM Categoria_Herramienta WHERE id_herramienta = @id_herramienta
                DELETE FROM Herramientas WHERE id_herramienta = @id_herramienta
                `);

                res.status(200).json({message: 'Herramienta eliminada correctamente.'});
                } catch (error) {
        console.error('Error al eliminar herramienta: ', error);
        res.status(500).json({ message: 'Error en el servidor al eliminar la herramienta' });
    }
};


module.exports = { getHerramientasAdmin, updateHerramienta, eliminarHerramienta };
