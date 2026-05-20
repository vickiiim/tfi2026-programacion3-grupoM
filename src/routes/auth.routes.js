import express from 'express';

import {
  register,
  login
} from '../controllers/userController.js';

const router = express.Router();

/**
 * @swagger
 * /api/usuarios/register:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Registrar usuario
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 */
router.post('/register', register);

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     tags:
 *       - Usuarios
 *     summary: Login de usuario
 *     responses:
 *       200:
 *         description: Login correcto
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

export default router;