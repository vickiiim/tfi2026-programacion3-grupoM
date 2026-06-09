import { Router } from 'express';
import { getAll, getById, create, update, remove } from '../../controllers/obrasSociales.controller.js';
import validarJWT from '../../middlewares/validar_jwt.js';
import { esAdmin } from '../../middlewares/validar_roles.js';

const router = Router();

/**
 * @swagger
 * /api/v2/obras-sociales:
 *   get:
 *     summary: Obtiene la lista de todas las obras sociales
 *     description: Retorna un arreglo con las obras sociales activas. Cualquier usuario logueado puede acceder.
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista obtenida correctamente.
 *       401:
 *         description: No autorizado (Token faltante o inválido).
 */
router.get('/', validarJWT, getAll);

/**
 * @swagger
 * /api/v2/obras-sociales/{id}:
 *   get:
 *     summary: Obtiene los datos de una obra social en particular
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la obra social
 *     responses:
 *       200:
 *         description: Obra social encontrada.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Obra social no encontrada.
 */
router.get('/:id', validarJWT, getById);

/**
 * @swagger
 * /api/v2/obras-sociales:
 *   post:
 *     summary: Crea una nueva obra social (SOLO ADMIN)
 *     description: Requiere privilegios de Administrador.
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *               - porcentaje_descuento
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "OSDE"
 *               descripcion:
 *                 type: string
 *                 example: "Plan 210"
 *               porcentaje_descuento:
 *                 type: number
 *                 example: 25.50
 *               es_particular:
 *                 type: integer
 *                 description: "0 para Obra Social, 1 para Particular"
 *                 example: 0
 *     responses:
 *       201:
 *         description: Obra social creada exitosamente.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado (Requiere rol Administrador).
 */
router.post('/', validarJWT, esAdmin, create);

/**
 * @swagger
 * /api/v2/obras-sociales/{id}:
 *   put:
 *     summary: Modifica los datos de una obra social existente (SOLO ADMIN)
 *     description: Requiere privilegios de Administrador.
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la obra social a modificar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               porcentaje_descuento:
 *                 type: number
 *               es_particular:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Obra social actualizada exitosamente.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado (Requiere rol Administrador).
 *       404:
 *         description: Obra social no encontrada.
 */
router.put('/:id', validarJWT, esAdmin, update);

/**
 * @swagger
 * /api/v2/obras-sociales/{id}:
 *   delete:
 *     summary: Elimina (soft-delete) una obra social (SOLO ADMIN)
 *     description: Requiere privilegios de Administrador. Modifica el campo activo a 0.
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la obra social a eliminar
 *     responses:
 *       200:
 *         description: Obra social eliminada correctamente.
 *       401:
 *         description: No autorizado.
 *       403:
 *         description: Acceso denegado (Requiere rol Administrador).
 *       404:
 *         description: Obra social no encontrada.
 */
router.delete('/:id', validarJWT, esAdmin, remove);

export default router;