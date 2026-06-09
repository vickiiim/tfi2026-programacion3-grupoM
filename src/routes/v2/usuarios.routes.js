import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validar_campos.js'; // <-- Verificá que esta ruta coincida con tu proyecto
import validarJWT from '../../middlewares/validar_jwt.js';
import { esAdmin } from '../../middlewares/validar_roles.js';
import { 
    actualizarRol,
    actualizarDatosPersonales, 
    eliminarUsuario            
} from '../../controllers/usuarios.controller.js';

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


/**
 * @swagger
 * /api/v2/usuarios/{id}:
 *   put:
 *     summary: Actualiza los datos personales (apellido, nombres, email) de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a modificar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - apellido
 *               - nombres
 *               - email
 *             properties:
 *               apellido:
 *                 type: string
 *               nombres:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Datos personales actualizados correctamente
 *       400:
 *         description: Error en la validación de los datos
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id', [
    validarJWT, // Exigimos que esté logueado para modificar
    check('id', 'El ID debe ser un número entero').isInt(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Debe ser un email válido').isEmail(),
    validarCampos
], actualizarDatosPersonales);

/**
 * @swagger
 * /api/v2/usuarios/{id}:
 *   delete:
 *     summary: Da de baja a un usuario del sistema (Borrado Lógico)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario dado de baja exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id', [
    validarJWT, 
    esAdmin,    
    check('id', 'El ID debe ser un número entero').isInt(),
    validarCampos
], eliminarUsuario);

export default router;