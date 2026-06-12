import * as medicosService from '../services/medicos.service.js';

export const obtenerTodos = async (req, res, next) => {
    try {
        // 1. Capturamos limit y offset de los Query Params con valores por defecto (ej: 10 y 0)
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const offset = req.query.offset ? Number(req.query.offset) : 0;

        // 2. Pasamos los parámetros al servicio
        const medicos = await medicosService.obtenerTodos(limit, offset);
        
        res.status(200).json({ estado: true, data: medicos });
    } catch (error) {
        next(error);
    }
};

export const obtenerPorEspecialidad = async (req, res, next) => {
    try {
        const { id_especialidad } = req.params;
        
        // 1. Capturamos limit y offset de los Query Params para esta búsqueda filtrada
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const offset = req.query.offset ? Number(req.query.offset) : 0;

        // 2. Pasamos el ID y los parámetros de paginación al servicio
        const medicos = await medicosService.obtenerPorEspecialidad(id_especialidad, limit, offset);
        
        res.status(200).json({ estado: true, data: medicos });
    } catch (error) {
        next(error);
    }
};

export const asociarObrasSociales = async (req, res, next) => {
    try {
        const { id_medico } = req.params;
        const { obras_sociales } = req.body; // Esto debe ser un array ej: [8-10]

        const resultado = await medicosService.asociarObrasSociales(id_medico, obras_sociales);
        
        res.status(201).json({ estado: true, data: resultado });
    } catch (error) {
        if(error.message.includes("ya estaban asociadas")) {
            return res.status(400).json({ estado: false, mensaje: error.message });
        }
        next(error);
    }
};

export const actualizarEspecialidad = async (req, res, next) => {
    try {
        const { id_medico } = req.params;
        const { id_especialidad } = req.body;

        const resultado = await medicosService.actualizarEspecialidad(id_medico, id_especialidad);
        
        res.status(200).json({ estado: true, data: resultado });
    } catch (error) {
        if(error.message.includes("Verifique que el ID del médico")) {
            return res.status(404).json({ estado: false, mensaje: error.message });
        }
        next(error);
    }
};

export const crearMedico = async (req, res, next) => {
    try {
        const datosMedico = req.body;

        const idNuevoMedico = await medicosService.crearMedico(datosMedico);

        res.status(201).json({
            estado: true,
            mensaje: 'Usuario convertido a médico con éxito',
            data: { 
                id_medico: idNuevoMedico, 
                ...datosMedico 
            }
        });
    } catch (error) {
        next(error);
    }
};