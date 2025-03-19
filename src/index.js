require('dotenv').config();
const express = require('express');
const cors = require('cors');
const loginRoutes = require('../routes/loginRoute'); // Importar las rutas de login

const app = express();
app.use(express.json());
app.use(cors());

// Usar el router de login
app.use('/login', loginRoutes); // Aquí es donde registras las rutas bajo /login

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Bienvenido a GearGo Backend! 🚀');
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});