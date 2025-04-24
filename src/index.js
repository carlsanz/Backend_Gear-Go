require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const loginRoutes = require('../routes/loginRoute'); 
const homeRoute = require('../routes/HomeRoute'); 
const RegistroRoute = require('../routes/RegistroRoute');
const toolBoxRoutes = require('../routes/ToolBoxRoute');
const alquileresRoutes = require('../routes/AlquileresRoute');
const notificacionesRoutes = require('../routes/NotificacionesRoute');


const app = express();
app.use(express.json());
app.use(cors());

// Configura la carpeta 'assets' como estática
app.use('/assets', express.static(path.join(__dirname, '../Frontend_Gear-GO/assets')));

app.use('/login', loginRoutes); 
app.use('/api/home', (req, res, next) => { next();}, homeRoute);

app.use('/usuario', RegistroRoute);

app.use('/toolbox', toolBoxRoutes);

app.use('/alquiler', alquileresRoutes); 

app.use('/notificaciones', notificacionesRoutes);


app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});