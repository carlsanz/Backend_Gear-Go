const { sql, poolPromise } = require('../config/db');

exports.crearHerramienta = async (req, res) => {
  const {
    nombre,
    descripcion,
    precio_por_dia,
    ubicacion,
    id_propietario,
    marca,
    modelo,
    condicion,
    id_categoria
  } = req.body;

  try {
    const pool = await poolPromise;

    // 1. Insertar herramienta y obtener ID
    const insertHerramienta = await pool.request()
      .input('Nombre', sql.VarChar, nombre)
      .input('descripcion', sql.VarChar, descripcion)
      .input('precio_por_dia', sql.Decimal(10, 2), precio_por_dia)
      .input('Ubicacion', sql.VarChar, ubicacion)
      .input('id_propietario', sql.Int, id_propietario)
      .input('Marca', sql.VarChar, marca)
      .input('Modelo', sql.VarChar, modelo)
      .input('Condicion', sql.VarChar, condicion)
      .input('estado', sql.VarChar, 'disponible')
      .query(`
        INSERT INTO Herramientas 
        (Nombre, descripcion, precio_por_dia, Ubicacion, id_propietario, Marca, Modelo, Condicion, estado)
        OUTPUT INSERTED.id_herramienta
        VALUES (@Nombre, @descripcion, @precio_por_dia, @Ubicacion, @id_propietario, @Marca, @Modelo, @Condicion, @estado)
      `);

    const id_herramienta = insertHerramienta.recordset[0].id_herramienta;

    // 2. Insertar categoría
    await pool.request()
      .input('id_herramienta', sql.Int, id_herramienta)
      .input('id_categoria', sql.Int, id_categoria)
      .query(`
        INSERT INTO Categoria_Herramienta (id_herramienta, id_categoria) 
        VALUES (@id_herramienta, @id_categoria)
      `);

    // 3. Insertar imágenes (si hay)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imagenBase64 = file.buffer.toString('base64');
        await pool.request()
          .input('id_herramienta', sql.Int, id_herramienta)
          .input('imagen', sql.VarChar(sql.MAX), imagenBase64)
          .query(`
            INSERT INTO Imagenes_Herramientas (id_herramienta, imagen)
            VALUES (@id_herramienta, @imagen)
          `);
      }
    }

    res.status(201).json({ mensaje: 'Herramienta creada con éxito', id_herramienta });
  } catch (error) {
    console.error('Error al crear herramienta:', error);
    res.status(500).json({ mensaje: 'Error al crear la herramienta', error });
  }
};

