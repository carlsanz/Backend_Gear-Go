const sql = require('mssql');

const dbConfig = {
    user: 'sa',
    password: 'Man7equ!lla',
    server: 'DESKTOP-P8RVH97',
    database: 'GearGo',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Conectado a SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
        throw err;
    });

module.exports = { sql, poolPromise };
