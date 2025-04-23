const express = require('express');
const router = express.Router();
const multer = require('multer');
const herramientasController = require('../controllers/HerramientasController');

const storage = multer.memoryStorage(); // Puedes cambiar a diskStorage si deseas guardar archivos localmente
const upload = multer({ storage: storage });

router.post('/nueva', upload.array('imagenes', 2), herramientasController.crearHerramienta);

module.exports = router;
