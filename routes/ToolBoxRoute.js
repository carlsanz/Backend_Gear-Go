// routes/ToolBoxRoute.js

const express = require('express');
const router = express.Router();
const ToolBoxController = require('../controllers/ToolBoxController');


router.get('/:id_usuario', ToolBoxController.getToolBoxItems);


router.post('/', ToolBoxController.createToolBoxItem);

module.exports = router;