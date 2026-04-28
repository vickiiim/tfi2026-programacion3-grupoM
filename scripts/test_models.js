import Especialidad from '../models/especialidades.model.js';

const probarModelos = async () => {
    try {
        console.log("Probando getAll() de Especialidades...");
        
        const especialidades = await Especialidad.getAll();
        
        console.table(especialidades);

        // console.log("Probando getById()...");
        // const unaEsp = await Especialidad.getById(1);
        // console.log(unaEsp);

        process.exit(0); 
    } catch (error) {
        console.error("Hubo un error en la base de datos:", error);
        process.exit(1);
    }
};

// Prueba
probarModelos();