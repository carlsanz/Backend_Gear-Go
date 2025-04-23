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
    
    next();
}, homeRoute);

app.use('/usuario', RegistroRoute);

app.use('/toolbox', toolBoxRoutes);

app.use('/alquiler', alquileresRoutes); 

app.use('/notificaciones', notificacionesRoutes);


app.get('/', (req, res) => {
    res.send('¡Bienvenido a GearGo Backend! 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});