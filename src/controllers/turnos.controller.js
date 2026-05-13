import TurnosService from '../services/turnos.service.js';

const turnosService = new TurnosService();

export default class TurnosController {
    
    // Listar turnos propios (médico o paciente)
    async obtenerTurnosPropios(req, res, next) {
        try {
            const id_usuario = req.usuario.id_usuario; 
            const rol = req.usuario.rol; 

            const turnos = await turnosService.obtenerTurnosPropios(id_usuario, rol);

            res.status(200).json({ estado: true, data: turnos });
        } catch (error) {
            res.status(500).json({ estado: false, mensaje: error.message });
        }
    }

    // Obtener todos los turnos
    async obtenerTodos(req, res, next) {
        try {
            const turnos = await turnosService.obtenerTodos();

            res.status(200).json({ estado: true, data: turnos });
        } catch (error) {
            next(error); 
        }
    }

    // Obtener un turno por ID
    async obtenerPorId(req, res, next) {
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
    }

    // Crear el turno
    async crearTurno(req, res, next) {
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
    }

    // Marcar como atendido (PUT/PATCH)
    async marcarComoAtendido(req, res, next) {
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
    }

    // Eliminar (Soft Delete)
    async eliminar(req, res, next) {
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
    }
}