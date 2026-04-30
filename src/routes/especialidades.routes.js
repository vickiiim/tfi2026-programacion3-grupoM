import { Router } from 'express';
import { check, param } from 'express-validator';
import especialidadesController from '../controllers/especialidades.controller.js';
import validarCampos from '../middlewares/validar_campos.js';
import validarJWT from '../middlewares/validar_jwt.js';   
import { esAdmin } from '../middlewares/validar_roles.js';


const router = Router();

/**
 * @swagger
 * /api/especialidades:
 *   get:
 *     summary: Obtiene todas las especialidades activas.
 *     tags: [Especialidades]
 *     responses:
 *       200:
 *         description: Lista de especialidades obtenida con éxito.
 */
router.get('/', 
    [
        validarJWT 
    ], 
    especialidadesController.obtenerTodas
);

/**
 * @swagger
 * /api/especialidades/{id}:
 *   get:
 *     summary: Obtiene una especialidad específica por su ID.
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Especialidad encontrada.
 */
router.get('/:id', 
    [
        validarJWT,
        param('id', 'El ID debe ser un número entero').isInt(),
        validarCampos
    ], 
    especialidadesController.obtenerPorId
);

/**
 * @swagger
 * /api/especialidades:
 *   post:
 *     summary: Crea una nueva especialidad (SOLO ADMIN).
 *     tags: [Especialidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "PEDIATRÍA"
 *     responses:
 *       201:
 *         description: Especialidad creada con éxito.
 */
router.post('/', 
    [
        validarJWT,
        esAdmin,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('nombre', 'El nombre no debe superar los 120 caracteres').isLength({ max: 120 }), 
        validarCampos 
    ], 
    especialidadesController.crear
);

/**
 * @swagger
 * /api/especialidades/{id}:
 *   put:
 *     summary: Modifica una especialidad existente (SOLO ADMIN).
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Especialidad modificada.
 */
router.put('/:id', 
    [
        validarJWT,
        esAdmin,
        param('id', 'El ID debe ser un número entero').isInt(),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('nombre', 'El nombre no debe superar los 120 caracteres').isLength({ max: 120 }),
        validarCampos 
    ], 
    especialidadesController.actualizar
);

/**
 * @swagger
 * /api/especialidades/{id}:
 *   delete:
 *     summary: Realiza un borrado lógico (SOLO ADMIN).
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.delete('/:id', 
    [
        validarJWT,
        esAdmin,
        param('id', 'El ID debe ser un número entero').isInt(),
        validarCampos
    ], 
    especialidadesController.borrar
);

export default router;