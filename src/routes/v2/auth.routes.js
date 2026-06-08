import express from 'express';
import { check } from 'express-validator';
import validarCampos from '../../middlewares/validar_campos.js';
import upload from '../../middlewares/multerConfig.js';
import { login, register } from '../../controllers/usuarios.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/v2/login:
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
router.post('/login', 
    [
        check('email', 'El correo electrónico es obligatorio y debe ser válido').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ], 
    login 
);

/**
 * @swagger
 *  /api/v2/register:
 *   post:
 *     summary: Registrar un nuevo usuario (paciente) en el sistema
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nombres
 *               - apellido
 *               - documento
 *               - email
 *               - password
 *               - id_obra_social
 *             properties:
 *               nombres:
 *                 type: string
 *               apellido:
 *                 type: string
 *               documento:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               id_obra_social:
 *                 type: integer
 *                 description: ID de la Obra Social del paciente (Ej. 1, 2, 3 o 4)
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil del usuario
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Error de validación en los datos enviados
 */
router.post('/register', 
    upload.single('foto'), // 1. Multer procesa el form-data primero
    [
        // 2. express-validator valida los campos extraídos
        check('nombres', 'El nombre es obligatorio').not().isEmpty(),
        check('apellido', 'El apellido es obligatorio').not().isEmpty(),
        check('documento', 'El documento es obligatorio').not().isEmpty(),
        check('email', 'El correo electrónico debe ser válido').isEmail(),
        check('password', 'La contraseña es obligatoria y debe tener al menos 6 caracteres').isLength({ min: 6 }),
        check('id_obra_social', 'La obra social es obligatoria').not().isEmpty(),
        check('id_obra_social', 'El ID de la obra social debe ser un número entero').isInt(),
        
        validarCampos 
    ], 
    register 
);

export default router;