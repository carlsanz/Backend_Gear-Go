const express = require('express');
const router = express.Router();
const { getHerramientasAdmin, updateHerramienta, eliminarHerramienta} = require ('../controllers/HerramientasController');
const cors = require('cors');

const app = express();

app.use(cors());

//ruta para obtener las herramientas no aprobadas
router.get('/herramientasAdmin', getHerramientasAdmin);

//ruta para actualizar la herramienta como aprobada
router.put('/aprobar/:id_herramienta', updateHerramienta);

//ruta para eliminar o denegar una herramienta sera eliminada 
router.delete('/eliminar/:id_herramienta', eliminarHerramienta)

module.exports = router;

