const mysql = require('mysql2');

const dbConfig = {
    host: 'localhost',
    user: 'root', // Cambia 'tu_usuario' por tu nombre de usuario de MySQL
    password: '', // Cambia 'tu_contraseña' por tu contraseña de MySQL
    database: 'information_schema',
    port:3306
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