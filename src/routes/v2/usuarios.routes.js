import express from 'express';
import validarJWT from '../../middlewares/validar_jwt.js';
import { esAdmin } from '../../middlewares/validar_roles.js';
import { actualizarRol } from '../../controllers/usuarios.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/v2/usuarios/{id}/rol:
 *   put:
 *     summary: Modificar el rol de un usuario (Solo Administradores)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario al que se le cambiará el rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rol
 *             properties:
 *               rol:
 *                 type: integer
 *                 example: 1
 *                 description: 1 (Médico), 2 (Paciente), 3 (Admin)
 *     responses:
 *       200:
 *         description: Rol actualizado con éxito
 *       400:
 *         description: El rol proporcionado no es válido
 *       401:
 *         description: Token no válido o ausente
 *       403:
 *         description: Acceso denegado. Requiere privilegios de Administrador
 */
router.put('/:id/rol', [validarJWT, esAdmin], actualizarRol);

export default router;