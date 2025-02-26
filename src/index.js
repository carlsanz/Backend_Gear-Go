require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('../config/db'); // Importar la conexión desde la carpeta config

const app = express();
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Bienvenido a GearGo Backend! 🚀');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🔗 Servidor corriendo en http://localhost:${PORT}`);
});
