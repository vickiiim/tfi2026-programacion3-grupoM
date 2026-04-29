import express from 'express';
import cors from 'cors';
import { setupSwagger } from './docs/swagger.js';

process.loadEnvFile();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- ESTO ES LO QUE FALTA ---
setupSwagger(app); 
// ----------------------------

const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
    console.log(`servidor iniciado OK en puerto ${PUERTO}`);
});