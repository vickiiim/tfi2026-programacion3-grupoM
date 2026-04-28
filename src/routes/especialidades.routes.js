const express = require('express');
const router = express.Router();
const especialidadesController = require('../controllers/especialidades.controller');

// Definimos los caminos (endpoints)
router.get('/', especialidadesController.getAll);
router.delete('/:id', especialidadesController.deleteEspecialidad);

module.exports = router;