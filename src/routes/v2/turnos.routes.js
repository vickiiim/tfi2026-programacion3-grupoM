import { Router } from 'express';
import TurnosController from '../../controllers/turnos.controller.js';
import { check, param } from 'express-validator';
import validarCampos from '../../middlewares/validar_campos.js';
import validarJWT from '../../middlewares/validar_jwt.js';
import { validarRoles } from '../../middlewares/validar_roles.js';

const router = Router();
const turnosController = new TurnosController();


/**
 * @swagger
 * /api/v2/turnos:
 *   get:
 *     summary: Listar turnos propios (CADA ROL VE LOS SUYOS)
 *     description: Obtiene la lista de turnos asignados al usuario autenticado. El ID y el rol se extraen automáticamente del token JWT, por lo que no requiere enviar parámetros.
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos obtenida exitosamente.
 *       401:
 *         description: No autorizado (Token faltante o inválido).
 *       403:
 *         description: Acceso denegado (El rol no tiene permiso).
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', [
    validarJWT,
    validarRoles(1, 2, 3),
], turnosController.obtenerTurnosPropios);

/**
 * @swagger
 * /api/v2/turnos/{id}:
 *   get:
 *     summary: Obtener un turno por ID
 *     description: Retorna los detalles de un turno específico buscando por su número de ID.
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID numérico del turno que se desea obtener.
 *     responses:
 *       200:
 *         description: Turno obtenido exitosamente.
 *       400:
 *         description: Error de validación (El ID no es un número entero).
 *       401:
 *         description: No autorizado (Token faltante o inválido).
 *       404:
 *         description: Turno no encontrado o inactivo.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:id', [
    validarJWT,
    param('id', 'El ID del turno debe ser un número entero').isInt(),
    validarCampos
], turnosController.obtenerPorId);

/**
 * @swagger
 * /api/v2/turnos:
 *   post:
 *     summary: Crear un nuevo turno (PACIENTES Y ADMINS)
 *     description: Registra una nueva reserva de turno. Solo los Pacientes (Rol 2) y Administradores (Rol 3) tienen permiso.
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_medico
 *               - id_paciente
 *               - fecha_hora
 *             properties:
 *               id_medico:
 *                 type: integer
 *                 example: 1
 *               id_paciente:
 *                 type: integer
 *                 example: 2
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-10-21T18:00:00.000Z"
 *     responses:
 *       201:
 *         description: Turno registrado exitosamente.
 *       400:
 *         description: Error de validación en los datos enviados.
 *       403:
 *         description: Acceso denegado (Rol no permitido).
 */
router.post('/', [
    validarJWT,
    validarRoles(2, 3), 
    check('id_medico', 'El ID del médico es obligatorio y debe ser numérico').isInt(),
    check('id_paciente', 'El ID del paciente es obligatorio y debe ser numérico').isInt(),
    check('fecha_hora', 'La fecha y hora de la reserva es obligatoria').notEmpty(),
    validarCampos
], turnosController.crearTurno);

/**
 * @swagger
 * /api/v2/turnos/{id}/atendido:
 *   put:
 *     summary: Marcar un turno como atendido (SOLO MÉDICOS)
 *     description: Actualiza el estado de un turno a "atendido". Acción exclusiva para Médicos (Rol 1).
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico del turno a modificar.
 *     responses:
 *       200:
 *         description: Turno marcado como atendido correctamente.
 *       400:
 *         description: Error de validación.
 *       403:
 *         description: Acceso denegado (Rol no permitido).
 *       404:
 *         description: Turno no encontrado.
 */
router.put('/:id/atendido', [
    validarJWT,
    validarRoles(1),
    check('id', 'El ID del turno debe ser un número entero').isInt(),
    validarCampos
], turnosController.marcarComoAtendido);

/**
 * @swagger
 * /api/v2/turnos/{id}:
 *   delete:
 *     summary: Eliminar (cancelar) un turno (PACIENTES Y ADMINS)
 *     description: Realiza un borrado lógico (Soft Delete) del turno. Permitido para Pacientes (Rol 2) y Administradores (Rol 3).
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID numérico del turno a cancelar.
 *     responses:
 *       200:
 *         description: Turno cancelado/eliminado correctamente.
 *       400:
 *         description: Error de validación.
 *       403:
 *         description: Acceso denegado (Rol no permitido).
 *       404:
 *         description: Turno no encontrado.
 */
router.delete('/:id', [
    validarJWT,
    validarRoles(2, 3),
    check('id', 'El ID del turno debe ser un número entero').isInt(),
    validarCampos
], turnosController.eliminar);

export default router;