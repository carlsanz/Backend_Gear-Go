require('dotenv').config();
const express = require('express');
const cors = require('cors');
const loginRoutes = require('../routes/loginRoute'); 
const homeRoute = require('../routes/HomeRoute'); 
const HerramientasRoute = require('../routes/HerramientasRoute');
const UsuarioRoute = require('../routes/UsuarioRoute');
const RegistroRoute = require('../routes/RegistroRoute');
const toolBoxRoutes = require('../routes/ToolBoxRoute');
const alquileresRoutes = require('../routes/AlquileresRoute');
const notificacionesRoutes = require('../routes/NotificacionesRoute');
const PagosRoutes = require('../routes/PagosRoute');



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

app.use('/herramientas', HerramientasRoute);

app.use('/usuarios', UsuarioRoute);

app.use('/pagos', PagosRoutes);


app.get('/', (req, res) => {
    res.send('¡Bienvenido a GearGo Backend! 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});