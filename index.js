process.loadEnvFile();

import express from 'express';
import cors from 'cors';
import { setupSwagger } from './src/docs/swagger.js';
import authRoutes from './src/routes/auth.routes.js';
import especialidadesRouterV1 from './src/routes/v1/especialidades.routes.js'; 


const app = express();

app.use(cors());
app.use(express.json()); 
app.use('/api/especialidades', especialidadesRouterV1);
app.use('/api/v1/especialidades', especialidadesRouterV1);
app.use('/api', authRoutes);

setupSwagger(app); 

const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
    console.log(`servidor iniciado OK en puerto ${PUERTO}`);
});