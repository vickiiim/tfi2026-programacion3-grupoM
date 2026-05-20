import express from 'express';

import {
  register,
  login
} from '../controllers/usuarios.controller.js';

import upload from '../middlewares/multerConfig.js';

import validarJWT from '../middlewares/validar_jwt.js';

import { esMedico } from '../middlewares/validar_roles.js';

const router = express.Router();

/**
 * @swagger
 * /api/usuarios/register:
 *   post:
 *     summary: Registrar usuario
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *               apellido:
 *                 type: string
 *               documento:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               id_rol:
 *                 type: integer
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 */
router.post(
  '/register',
  upload.single('foto'),
  register
);

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Login de usuario
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 */
router.post('/login', login);

/**
 * @swagger
 * /api/usuarios/test:
 *   get:
 *     tags:
 *       - Usuarios
 *     summary: Endpoint de prueba
 *     responses:
 *       200:
 *         description: Funciona correctamente
 */
router.get('/test', (req, res) => {
  res.send('OK');
});

/**
 * @swagger
 * /api/usuarios/solo-medicos:
 *   get:
 *     summary: Ruta protegida para médicos
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acceso permitido para médicos
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado
 */
router.get(
  '/solo-medicos',
  validarJWT,
  esMedico,
  (req, res) => {

    res.json({
      mensaje: 'Bienvenido médico'
    });

  }
);

export default router;