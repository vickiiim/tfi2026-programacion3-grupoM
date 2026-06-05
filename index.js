process.loadEnvFile();

import express from 'express';
import { setupSwagger } from './src/docs/swagger.js';

import authRoutes from './src/routes/v2/auth.routes.js'; 
import usuariosRoutes from './src/routes/v2/usuarios.routes.js'; 
import especialidadesRouterV1 from './src/routes/v1/especialidades.routes.js';
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

<<<<<<< HEAD
// --- RUTAS V1 ---
app.use('/api/especialidades', especialidadesRouterV1); 
app.use('/api/v1/especialidades', especialidadesRouterV1);

// --- RUTAS V2 ---
app.use('/api/v2/especialidades', especialidadesRouterV1); 
app.use('/api/v2/turnos', turnosRoutes);

// --- RUTAS GLOBALES ---
app.use('/api', authRoutes);
=======
app.use('/uploads', express.static('uploads'));

app.use('/api/especialidades', especialidadesRouterV1);
app.use('/api/v1/especialidades', especialidadesRouterV1);

app.use('/api/v2', authRoutes); 
app.use('/api/v2/usuarios', usuariosRoutes); 

>>>>>>> abd67bdb72a6bc023aa43ae232f7d33f7faeb752

setupSwagger(app);

app.use(errorHandler);

const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
    console.log(`✅ Servidor iniciado OK en puerto ${PUERTO}`);
    console.log(`🚀 Swagger: http://localhost:${PUERTO}/api-docs`);
});