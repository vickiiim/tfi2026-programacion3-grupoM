process.loadEnvFile();

import express from 'express';
import { setupSwagger } from './src/docs/swagger.js';
import authRoutes from './src/routes/auth.routes.js';
import especialidadesRouterV1 from './src/routes/v1/especialidades.routes.js';
import obrasSocialesRouterV2 from './src/routes/v2/obrasSociales.routes.js';

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

app.use('/api/especialidades', especialidadesRouterV1);
app.use('/api/v1/especialidades', especialidadesRouterV1);
app.use('/api/v2/obras-sociales', obrasSocialesRouterV2);
app.use('/api', authRoutes);

setupSwagger(app);

app.use(errorHandler);

const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
    console.log(`servidor iniciado OK en puerto ${PUERTO}`);
});