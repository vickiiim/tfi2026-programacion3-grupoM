import express from 'express';
import { check } from 'express-validator';
import validarCampos from '../middlewares/validar_campos.js';
import { login } from '../controllers/usuarios.controller.js';

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Iniciar sesión y obtener token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: lopmar@correo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: benhor
 *     responses:
 *       200:
 *         description: Login exitoso. Devuelve el token JWT.
 *       400:
 *         description: Faltan datos o el formato es incorrecto.
 *       401:
 *         description: Credenciales inválidas.
 */
const router = express.Router();

router.post('/login', 
    [
        check('email', 'El correo electrónico es obligatorio y debe ser válido').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ], 
    login 
);

export default router;
