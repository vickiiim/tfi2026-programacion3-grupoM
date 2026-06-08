import express from 'express';
import { check, param } from 'express-validator';
import validarCampos from '../../middlewares/validar_campos.js';
import validarJWT from '../../middlewares/validar_jwt.js';
import { esAdmin } from '../../middlewares/validar_roles.js';
import { 
    obtenerTodos, 
    obtenerPorEspecialidad, 
    asociarObrasSociales,
    actualizarEspecialidad,
    crearMedico
} from '../../controllers/medicos.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/v2/medicos:
 *   get:
 *     summary: Obtener la lista de todos los médicos activos
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de médicos obtenida correctamente con sus datos personales y especialidad
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 */
router.get('/', validarJWT, obtenerTodos);

/**
 * @swagger
 * /api/v2/medicos/especialidad/{id_especialidad}:
 *   get:
 *     summary: Obtener médicos filtrados por el ID de su especialidad
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_especialidad
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la especialidad
 *     responses:
 *       200:
 *         description: Lista de médicos filtrada obtenida correctamente
 *       400:
 *         description: Error de validación (el parámetro no es un número)
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 */
router.get(
    '/especialidad/:id_especialidad', 
    [
        validarJWT,
        param('id_especialidad', 'El ID de la especialidad debe ser un número entero').isInt(),
        validarCampos
    ], 
    obtenerPorEspecialidad
);

/**
 * @swagger
 * /api/v2/medicos/{id_medico}/obras-sociales:
 *   post:
 *     summary: Asociar múltiples obras sociales a un médico (Solo Administrador)
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_medico
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del médico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - obras_sociales
 *             properties:
 *               obras_sociales:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Arreglo de IDs de obras sociales a asociar
 *                 example: [6, 8]
 *     responses:
 *       201:
 *         description: Obras sociales asociadas exitosamente
 *       400:
 *         description: Error de validación (datos incorrectos o asociaciones ya existentes)
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 *       403:
 *         description: Prohibido (El usuario no tiene rol de Administrador)
 */
router.post(
    '/:id_medico/obras-sociales',
    [
        validarJWT,
        esAdmin,
        param('id_medico', 'El ID del médico debe ser un número entero').isInt(),
        check('obras_sociales', 'Debes enviar un arreglo de obras sociales').isArray({ min: 1 }),
        check('obras_sociales.*', 'Cada ID de obra social debe ser un número entero').isInt(),
        validarCampos
    ],
    asociarObrasSociales
);

/**
 * @swagger
 * /api/v2/medicos/{id_medico}/especialidad:
 *   patch:
 *     summary: Modificar la especialidad de un médico (Solo Administrador)
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_medico
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del médico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_especialidad
 *             properties:
 *               id_especialidad:
 *                 type: integer
 *                 description: Nuevo ID de la especialidad a asignar
 *                 example: 3
 *     responses:
 *       200:
 *         description: Especialidad actualizada exitosamente
 *       400:
 *         description: Error de validación (datos incorrectos)
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 *       403:
 *         description: Prohibido (El usuario no tiene rol de Administrador)
 *       404:
 *         description: Médico no encontrado
 */
router.patch(
    '/:id_medico/especialidad',
    [
        validarJWT,
        esAdmin,
        param('id_medico', 'El ID del médico debe ser un número entero').isInt(),
        check('id_especialidad', 'Debes enviar el ID de la nueva especialidad como número entero').isInt(),
        validarCampos
    ],
    actualizarEspecialidad
);

/**
 * @swagger
 * /api/v2/medicos:
 *   post:
 *     summary: Convierte a un usuario existente en médico
 *     tags: [Médicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_usuario
 *               - id_especialidad
 *               - matricula
 *               - valor_consulta
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 description: ID del usuario existente en la tabla usuarios.
 *               id_especialidad:
 *                 type: integer
 *                 description: ID de la especialidad del médico.
 *               matricula:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               valor_consulta:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Usuario convertido a médico exitosamente
 *       400:
 *         description: Error en la validación de los datos enviados
 *       401:
 *         description: No autorizado (Falta token o es inválido)
 *       403:
 *         description: Prohibido (No tiene rol de Administrador)
 */
router.post('/', [
    validarJWT, 
    esAdmin,
    check('id_usuario', 'El ID del usuario es obligatorio y debe ser entero').isInt(),
    check('id_especialidad', 'La especialidad es obligatoria y debe ser entera').isInt(),
    check('matricula', 'La matrícula es obligatoria').not().isEmpty(),
    check('valor_consulta', 'El valor de la consulta es obligatorio').isNumeric(),
    check('descripcion', 'La descripción no puede estar vacía').optional().isString(),
    validarCampos 
], crearMedico);

export default router;