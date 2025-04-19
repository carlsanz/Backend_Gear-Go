const express = require('express');
const router = express.Router();
const { getHerramientas } = require('../controllers/HomeController');
const cors = require('cors');

const app = express();


app.use(cors());

// Ruta para obtener todas las herramientas
router.get('/herramientas', getHerramientas);

module.exports = router;
