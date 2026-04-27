const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const especialidadesRoutes = require('./routes/especialidades.routes');

// Middlewares (Clase 5 y 6)
app.use(cors());
app.use(express.json());

// Usar las rutas
app.use('/especialidades', especialidadesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor de la Clínica funcionando en http://localhost:${PORT}`);
});