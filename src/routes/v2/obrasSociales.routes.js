import { Router } from 'express';
import { getAll, getById, create, update, remove } from '../../controllers/obrasSociales.controller.js';
import validarJWT from '../../middlewares/validar_jwt.js';
import { esAdmin } from '../../middlewares/validar_roles.js';

const router = Router();

// Listar todas - cualquier usuario autenticado
router.get('/', validarJWT, getAll);

// Buscar por ID - cualquier usuario autenticado
router.get('/:id', validarJWT, getById);

// Crear - solo administrador
router.post('/', validarJWT, esAdmin, create);

// Modificar - solo administrador
router.put('/:id', validarJWT, esAdmin, update);

// Borrar - solo administrador
router.delete('/:id', validarJWT, esAdmin, remove);

export default router;