import * as turnosService from '../services/turnos.service.js';

// Listar turnos propios (médico o paciente)
export const obtenerTurnosPropios = async (req, res, next) => {
    try {
        const id_usuario = req.usuario.id_usuario; 
        const rol = req.usuario.rol; 
        
        // 1. Capturamos limit y offset de la URL. Si no existen, usamos 10 y 0 por defecto.
        const limit = req.query.limit || 10;
        const offset = req.query.offset || 0;

        // 2. Se los enviamos al servicio
        const turnos = await turnosService.obtenerTurnosPropios(id_usuario, rol, limit, offset);

        res.status(200).json({ estado: true, data: turnos });
    } catch (error) {
        res.status(500).json({ estado: false, mensaje: error.message });
    }
};

// Obtener todos los turnos
export const obtenerTodos = async (req, res, next) => {
    try {
        // 1. Capturamos limit y offset de la URL. Si no existen, usamos 10 y 0 por defecto.
        const limit = req.query.limit || 10;
        const offset = req.query.offset || 0;

        // 2. Se los enviamos al servicio
        const turnos = await turnosService.obtenerTodos(limit, offset);

        res.status(200).json({ estado: true, data: turnos });
    } catch (error) {
        next(error); 
    }
};

// Obtener un turno por ID
export const obtenerPorId = async (req, res, next) => {
    try {
        const { id } = req.params; // Extraemos el ID de la URL
        const turnos = await turnosService.obtenerPorId(id);

        if (!turnos || turnos.length === 0) {
            return res.status(404).json({ 
                estado: false, 
                mensaje: 'Turno no encontrado' 
            });
        }

        res.status(200).json({ estado: true, data: turnos });
    } catch (error) {
        next(error);
    }
};

// Crear el turno
export const crearTurno = async (req, res, next) => {
    try {
        const nuevoTurno = await turnosService.crearTurno(req.body);
        
        res.status(201).json({ 
            estado: true, 
            mensaje: 'Turno registrado exitosamente', 
            data: nuevoTurno 
        });
    } catch (error) {
        error.status = 400;
        next(error);
    }
};

// Marcar como atendido (PUT/PATCH)
export const marcarComoAtendido = async (req, res, next) => {
    try {
        const { id } = req.params;
        const filasAfectadas = await turnosService.marcarComoAtendido(id);

        if (filasAfectadas === 0) {
            return res.status(404).json({ estado: false, mensaje: 'Turno no encontrado para modificar' });
        }

        res.status(200).json({ estado: true, mensaje: 'Turno marcado como atendido correctamente' });
    } catch (error) {
        next(error);
    }
};

// Eliminar (Soft Delete)
export const eliminar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const filasAfectadas = await turnosService.eliminar(id);

        if (filasAfectadas === 0) {
            return res.status(404).json({ estado: false, mensaje: 'Turno no encontrado para eliminar' });
        }

        res.status(200).json({ estado: true, mensaje: 'Turno cancelado/eliminado correctamente' });
    } catch (error) {
        next(error);
    }
};