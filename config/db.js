const mysql = require('mysql2');

const dbConfig = {
    host: 'localhost',
    user: 'tu_usuario', // Cambia 'tu_usuario' por tu nombre de usuario de MySQL
    password: 'tu_contraseña', // Cambia 'tu_contraseña' por tu contraseña de MySQL
    database: 'TallerMecanico'
};

// Crear conexión a la base de datos
const connection = mysql.createConnection(dbConfig);

// Conectar a la base de datos
connection.connect(err => {
    if (err) {
        console.error('❌ Error al conectar a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL');
});

module.exports = connection;