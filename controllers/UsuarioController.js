const { json } = require('express');
const { sql, poolPromise } = require('../config/db');

const getUsuarios = async (req, res) =>{
    try{
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT
                U.id_usuario,
                U.Nombre,
                II.imagen
            FROM
                Usuarios U
            LEFT JOIN Imagenes_Identificaciones II ON U.id_usuario = II.id_usuario
            WHERE U.Aceptada = 0
            `);

            const usuariosMap ={};
            result.recordset.forEach(rows=>{
                if (!usuariosMap[rows.id_usuario]){
                    usuariosMap[rows.id_usuario] ={
                        id_usuario: rows.id_usuario,
                        Nombre: rows.Nombre,
                        imagenes: [],
                    };
                }
                if (rows.imagen){
                    usuariosMap[rows.id_usuario].imagenes.push('http://192.168.43.26:5000${row.imagen}');
                }
            });

            const usuarios = Object.values(usuariosMap);
            res.json(usuarios);
            } catch (error) {
                console.error('Error al obtener usuarios: ', error);
                res.status(500).json({message: 'Error en el servidor al obtener usuarios'});
    }
};

const aceptarUsuario = async(req, res) =>{
    const {id_usuario} = req.params;

    try{
        const pool = await poolPromise;

        await pool.request()
            .input('id_usuario', id_usuario)
            .query(`
                UPDATE Usuarios
                SET Aceptada= 1
                WHERE id_usuario= @id_usuario
                `);

        res.status(200).json({message: 'Usuario aceptado correctamente'});
    }catch (error) {
        console.error('Error al aceptar usuario: ', error);
        res.status(500).json({message: 'Error en el servidor'});
    }
};




module.exports = { getUsuarios, aceptarUsuario };