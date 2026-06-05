process.loadEnvFile();

import express from 'express';
import { setupSwagger } from './src/docs/swagger.js';

import authRoutes from './src/routes/v2/auth.routes.js'; 
import usuariosRoutes from './src/routes/v2/usuarios.routes.js'; 
import especialidadesRouterV1 from './src/routes/v1/especialidades.routes.js';
import pacientesRoutes from './src/routes/v2/pacientes.routes.js';
import medicosRoutes from './src/routes/v2/medicos.routes.js';
import turnosRoutes from './src/routes/v2/turnos.routes.js';


import corsMiddleware from './src/middlewares/cors.middleware.js';
import helmetMiddleware from './src/middlewares/helmet.middleware.js';
import morganMiddleware from './src/middlewares/morgan.middleware.js';
import rateLimitMiddleware from './src/middlewares/rateLimit.middleware.js';
import errorHandler from './src/middlewares/error.middleware.js';

const app = express();

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(rateLimitMiddleware);
app.use(morganMiddleware);
app.use(express.json());

// --- RUTAS V1 ---
app.use('/api/v1/especialidades', especialidadesRouterV1);
app.use('/api/especialidades', especialidadesRouterV1);

// --- RUTAS V2 ---
app.use('/api/v2/pacientes', pacientesRoutes);
app.use('/api/v2/medicos', medicosRoutes);
app.use('/api/v2/turnos', turnosRoutes);
app.use('/api/v2/usuarios', usuariosRoutes);
app.use('/api/v2', authRoutes);

// --- CONFIGURACIÓN DE ESTÁTICOS (MULTER) ---
app.use('/uploads', express.static('uploads'));
setupSwagger(app);

app.use(errorHandler);

const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
    console.log(`✅ Servidor iniciado OK en puerto ${PUERTO}`);
    console.log(`🚀 Swagger: http://localhost:${PUERTO}/api-docs`);
});