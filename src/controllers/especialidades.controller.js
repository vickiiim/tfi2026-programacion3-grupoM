import especialidadesService from '../services/especialidades.service.js';

// GET - Obtener todas las especialidades.
const obtenerTodas = async (req, res) => {
    try {
        const especialidades = await especialidadesService.obtenerTodas();
        // Devuelve un código 200 (OK) y los datos en formato JSON
        res.status(200).json(especialidades); 
    } catch (error) {
        // Atrapa errores de red o base de datos y devuelve un 500 (Error de Servidor)
        res.status(500).json({ error: error.message }); 
    }
};

// GET por ID - Obtener una especialidad específica
const obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        // Llamamos al servicio para buscar esa única especialidad
        const resultado = await especialidadesService.obtenerPorId(id);
        res.status(200).json(resultado);
    } catch (error) {
        const statusCode = error.message.includes("no encontrada") ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
};

// POST - Crear una especialidad.
const crear = async (req, res) => {
    try {
        // Extraemos el nombre que viene en el body de la petición
        const { nombre } = req.body; 
        
        // Llamamos al servicio pasándole los datos
        const resultado = await especialidadesService.crear({ nombre });
        
        // Si se crea correctamente, respondemos con 201 (Created)
        res.status(201).json({ mensaje: "Especialidad creada con éxito", id: resultado.insertId });
    } catch (error) {
        // Si el servicio lanza un error (Por ej. "Ya existe una especialidad con ese nombre"), devolvemos un 400
        res.status(400).json({ error: error.message });
    }
};

// PUT - Actualizar una especialidad existente.
const actualizar = async (req, res) => {
    try {
        // El ID viene por la URL (params)
        const { id } = req.params;
        // El nuevo nombre viene por el cuerpo (body)
        const { nombre } = req.body;
        
        // Llamamos al servicio de Sandra pasándole el ID y el nuevo nombre
        const resultado = await especialidadesService.actualizar(id, { nombre });
        
        // Respondemos con 200 OK porque es una actualización, no una creación
        res.status(200).json({ mensaje: "Especialidad modificada con éxito", resultado });
    } catch (error) {
        // Atrapamos si la especialidad no existe (404) o si hay otro error de negocio (400)
        const statusCode = error.message.includes("no encontrada") ? 404 : 400;
        res.status(statusCode).json({ error: error.message });
    }
};

// DELETE - Soft delete de una especialidad
const borrar = async (req, res) => {
    try {
        // Extraemos el ID numérico desde la URL
        const { id } = req.params;
        
        // Llamamos al servicio de Sandra para que cambie el estado activo a 0
        const resultado = await especialidadesService.borrar(id);
        
        // Respondemos con un 200 OK informando que se eliminó
        res.status(200).json({ mensaje: "Especialidad eliminada con éxito", resultado });
    } catch (error) {
        // Si el servicio no encuentra el ID o ya estaba inactiva, devolvemos 404
        const statusCode = error.message.includes("no encontrada") ? 404 : 500;
        res.status(statusCode).json({ error: error.message });
    }
};

export default {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    borrar
};