import especialidadesService from '../services/especialidades.service.js';

// GET - Obtener todas las especialidades.
const obtenerTodas = async (req, res) => {
    try {
        const especialidades = await especialidadesService.obtenerTodas();
        // Devuelve un código 200 (OK) y los datos en formato JSON
        return res.status(200).json(especialidades); 
    } catch (error) {
        // Atrapa errores de red o base de datos y devuelve un 500 (Error de Servidor)
        console.error("Error en el servidor al obtener especialidades:", error);
        return res.status(500).json({ error: "Error interno del servidor." }); 
    }
};

// GET por ID - Obtener una especialidad específica
const obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        // Llamamos al servicio para buscar esa única especialidad
        const resultado = await especialidadesService.obtenerPorId(id);
        return res.status(200).json(resultado);
    } catch (error) {
        // Si no la encuentra devolvemos 404, si es otro error devolvemos 500
        if (error.message.includes("no encontrada")) {
            return res.status(404).json({ error: error.message });
        }
        console.error("Error en el servidor al obtener por ID:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
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
        return res.status(201).json({ mensaje: "Especialidad creada con éxito", id: resultado.insertId });
    } catch (error) {
        const mensajeError = error.message.toLowerCase();

        // 1. Error de duplicado (El cliente mandó un nombre que ya existe)
        if (mensajeError.includes("ya existe") || mensajeError.includes("duplicada") || mensajeError.includes("duplicate entry")) {
            return res.status(400).json({ error: "La especialidad ingresada ya existe." });
        }
        
        // 2. Cualquier otro error (Falla de red, caída de MySQL, etc.)
        console.error("Error crítico en el servidor al crear:", error);
        return res.status(500).json({ error: "Error interno del servidor. Intente nuevamente más tarde." });
    }
};

// PUT - Actualizar una especialidad existente.
const actualizar = async (req, res) => {
    try {
        // El ID viene por la URL (params)
        const { id } = req.params;
        // El nuevo nombre viene por el cuerpo (body)
        const { nombre } = req.body;
        
        // Llamamos al servicio pasándole el ID y el nuevo nombre
        const resultado = await especialidadesService.actualizar(id, { nombre });
        
        // Respondemos con 200 OK porque es una actualización, no una creación
        return res.status(200).json({ mensaje: "Especialidad modificada con éxito", resultado });
    } catch (error) {
        const mensajeError = error.message.toLowerCase();

        // 1. Si el ID no existe en la base de datos (404)
        if (mensajeError.includes("no encontrada")) {
            return res.status(404).json({ error: error.message });
        }
        
        // 2. Si intenta ponerle un nombre que ya pertenece a otra especialidad (400)
        if (mensajeError.includes("ya existe") || mensajeError.includes("duplicada") || mensajeError.includes("duplicate entry")) {
            return res.status(400).json({ error: "El nuevo nombre de la especialidad ya está en uso." });
        }

        // 3. Cualquier otro error crítico de base de datos (500)
        console.error("Error crítico en el servidor al actualizar:", error);
        return res.status(500).json({ error: "Error interno del servidor. Intente nuevamente más tarde." });
    }
};

// DELETE - Soft delete de una especialidad
const borrar = async (req, res) => {
    try {
        // Extraemos el ID numérico desde la URL
        const { id } = req.params;
        
        // Llamamos al servicio para que cambie el estado activo a 0
        const resultado = await especialidadesService.borrar(id);
        
        // Respondemos con un 200 OK informando que se eliminó
        return res.status(200).json({ mensaje: "Especialidad eliminada con éxito", resultado });
    } catch (error) {
        // Si el servicio no encuentra el ID o ya estaba inactiva, devolvemos 404
        if (error.message.includes("no encontrada")) {
            return res.status(404).json({ error: error.message });
        }
        
        // Fallas del servidor (500)
        console.error("Error crítico en el servidor al borrar:", error);
        return res.status(500).json({ error: "Error interno del servidor. Intente nuevamente más tarde." });
    }
};

export default {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    borrar
};