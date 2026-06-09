import { Router } from 'express';
import { param } from 'express-validator';
import * as pacientesController from '../../controllers/pacientes.controller.js';
import upload from '../../middlewares/multerConfig.js'; 
import validarJWT from '../../middlewares/validar_jwt.js'; 
import { validarRoles } from '../../middlewares/validar_roles.js';
import validarCampos from '../../middlewares/validar_campos.js';

const router = Router();

/**
 * @swagger
 * /api/v2/pacientes:
 *   get:
 *     summary: Obtener todos los pacientes
 *     description: Retorna la lista completa de pacientes activos. Solo accesible para Médicos (Rol 1) y Administradores (Rol 3).
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pacientes obtenida exitosamente.
 *       401:
 *         description: No autorizado (Token faltante o inválido).
 *       403:
 *         description: Acceso denegado (Rol sin permisos).
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', [
    validarJWT,
    validarRoles(1, 3) // Solo Médicos y Administradores
], pacientesController.obtenerTodos);

/**
 * @swagger
 * /api/v2/pacientes/{id}:
 *   get:
 *     summary: Obtener un paciente por ID
 *     description: Retorna los detalles de un paciente específico. 
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID numérico del paciente.
 *     responses:
 *       200:
 *         description: Paciente obtenido exitosamente.
 *       400:
 *         description: Error de validación (El ID no es un número entero).
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Paciente no encontrado o inactivo.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:id', [
    validarJWT,
    validarRoles(1, 3), // Solo Médicos y Administradores
    param('id', 'El ID del paciente debe ser un número entero válido').isInt(),
    validarCampos 
], pacientesController.obtenerPorId);

/**
 * @swagger
 * /api/v2/pacientes/{id}:
 *   put:
 *     summary: Actualizar datos del paciente
 *     description: Permite actualizar el nombre, apellido y email de un paciente.
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apellido:
 *                 type: string
 *               nombres:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Datos del paciente actualizados con éxito.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/:id', [
    validarJWT,
    validarRoles(1, 3),
    param('id', 'El ID del paciente debe ser un número entero').isInt(),
    validarCampos
], pacientesController.actualizar);

/**
 * @swagger
 * /api/v2/pacientes/{id}/foto:
 *   put:
 *     summary: Subir o actualizar foto del paciente
 *     description: Permite subir una imagen avatar para el paciente.
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto subida exitosamente.
 */
router.put('/:id/foto', [
    validarJWT,
    validarRoles(1, 2, 3), //El paciente también puede subir su propia foto.
    param('id', 'El ID del paciente debe ser un número entero').isInt(),
    validarCampos,
    upload.single('foto') 
], pacientesController.subirFoto);

/**
 * @swagger
 * /api/v2/pacientes/{id}:
 *   delete:
 *     summary: Borrado lógico de un paciente
 *     description: Desactiva un paciente cambiando su estado a 0.
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paciente eliminado (desactivado) con éxito.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/:id', [
    validarJWT,
    validarRoles(3), //Solo admin
    param('id', 'El ID del paciente debe ser un número entero').isInt(),
    validarCampos
], pacientesController.eliminar);

/**
 * @swagger
 * /api/v2/pacientes/{id}/obra-social:
 *   put:
 *     summary: Asociar paciente con obra social
 *     description: Permite asignar o cambiar la obra social de un paciente. Solo Administradores (Rol 3).
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del paciente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_obra_social:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Obra social actualizada con éxito.
 *       400:
 *         description: Faltan parámetros en la solicitud.
 *       403:
 *         description: Acceso denegado (No es administrador).
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/:id/obra-social', [
    validarJWT,
    validarRoles(3), // Solo admin
    param('id', 'El ID del paciente debe ser un número entero').isInt(),
    validarCampos
], pacientesController.actualizarObraSocial);


export default router;


