process.loadEnvFile();

import express from 'express';
import { setupSwagger } from './swagger.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.use('/api/usuarios', userRoutes);

setupSwagger(app);

const PUERTO = 3000;

app.listen(PUERTO, () => {
    console.log(`✅ Servidor en puerto ${PUERTO}`);
    console.log(`🚀 Swagger: http://localhost:${PUERTO}/api-docs`);
});

setInterval(() => {}, 1000);