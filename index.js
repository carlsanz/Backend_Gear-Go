require('dotenv').config();
const express = require('express');
const cors = require('cors');
const loginRoutes = require('../routes/loginRoute'); 
const homeRoute = require('../routes/HomeRoute'); 


const app = express();
app.use(express.json());
app.use(cors());


app.use('/login', loginRoutes); 
app.use('/api/home', (req, res, next) => {
    console.log('Ruta /api/home llamada');
    next();
}, homeRoute);

app.get('/', (req, res) => {
    res.send('¡Bienvenido a GearGo Backend! 🚀');
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});