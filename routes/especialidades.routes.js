import express from 'express';
// Importamos los controladores que creaste antes
import { getAll, deleteEspecialidad } from '../controllers/especialidades.controller.js';

const router = express.Router();

// Vinculamos las rutas HTTP con las funciones de tu controlador
router.get('/', getAll);
router.delete('/:id', deleteEspecialidad);

// ¡Esta línea es la que index.js está esperando y soluciona el error!
export default router;