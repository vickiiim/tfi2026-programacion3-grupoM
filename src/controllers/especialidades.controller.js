import especialidadesService from '../services/especialidades.service.js';

// GET - Con paginación y filtro
const obtenerTodas = async (req, res, next) => { 
    try {
        const { limit, offset, order, nombre } = req.query;

        const parametrosBusqueda = {
            limit: limit ? parseInt(limit) : 10,     
            offset: offset ? parseInt(offset) : 0,   
            order: order || 'ASC',                   
            nombre: nombre || null                   
        };

        const especialidades = await especialidadesService.obtenerTodas(parametrosBusqueda);
        
        return res.status(200).json(especialidades); 
    } catch (error) {
        next(error); 
    }
};

// GET por ID - Obtener una especialidad específica
const obtenerPorId = async (req, res, next) => { 
    try {
        const { id } = req.params;
        const resultado = await especialidadesService.obtenerPorId(id);
        
        return res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

// POST - Crear una especialidad.
const crear = async (req, res, next) => {
    try {
        console.log("=== DATOS DE MULTER ===");
        console.log(req.file); 
        console.log("=======================");

        const { nombre } = req.body; 
        
        const resultado = await especialidadesService.crear({ nombre });
        
        // Si se crea correctamente, respondemos con 201 (Created)
        return res.status(201).json({ mensaje: "Especialidad creada con éxito", id: resultado.insertId });
    } catch (error) {
        next(error); 
    }
};

// PUT - Actualizar una especialidad existente.
const actualizar = async (req, res, next) => { // 1. Agregamos 'next'
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        
        // El servicio intenta actualizar y devuelve el DTO
        const resultado = await especialidadesService.actualizar(id, { nombre });
        
        return res.status(200).json({ mensaje: "Especialidad modificada con éxito", resultado });
    } catch (error) {
        // 2. Delegamos todos los errores al middleware global
        next(error); 
    }
};

// DELETE - Soft delete de una especialidad
const borrar = async (req, res, next) => { 
    try {
        const { id } = req.params;
        
        // El servicio hace el soft delete (activo = 0)
        const resultado = await especialidadesService.borrar(id);
        
        // Respondemos con un 200 OK informando que se eliminó lógicamente
        return res.status(200).json({ mensaje: "Especialidad eliminada con éxito", resultado });
    } catch (error) {
        next(error); 
    }
};

export default {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    borrar
};