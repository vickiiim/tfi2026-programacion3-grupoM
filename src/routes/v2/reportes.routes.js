import { Router } from 'express';
import { query } from 'express-validator';
import validarCampos from '../../middlewares/validar_campos.js';
import validarJWT from '../../middlewares/validar_jwt.js';
import { esAdmin } from '../../middlewares/validar_roles.js';
import reportesController from '../../controllers/reportes.controller.js';

const router = Router();

/**
 * @swagger
 * /api/v2/reportes/turnos:
 *   get:
 *     summary: Genera un PDF con el reporte de turnos (SOLO ADMIN)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del filtro (YYYY-MM-DD)
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin del filtro (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso denegado (se requiere rol de Administrador)
 *       500:
 *         description: Error interno del servidor
 */
router.get('/turnos',
    [
        validarJWT,
        esAdmin,
        query('desde').optional().isDate().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
        query('hasta').optional().isDate().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
        validarCampos
    ],
    reportesController.generarPDF
);

export default router;
