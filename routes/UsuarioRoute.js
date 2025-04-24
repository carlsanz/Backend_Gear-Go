const express = require('express');
const router = express.Router();
const {getUsuarios, aceptarUsuario} = require ('../controllers/UsuarioController');
const cors = require('cors');

const app = express();

app.use(cors());

//ruta para obtener los usuarios 

router.get('/obtener', getUsuarios);

//ruta para aceptacion de los usuarios 

router.put('/actualizar/:id_usuario', aceptarUsuario);

module.exports = router;