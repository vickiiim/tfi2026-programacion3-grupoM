import * as pacientesService from '../services/pacientes.service.js';

export const obtenerTodos = async (req, res, next) => {
    try {
        // 1. Capturamos los parámetros de paginación para el GET
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const offset = req.query.offset ? Number(req.query.offset) : 0;

        // Pasamos la paginación al servicio
        const pacientes = await pacientesService.obtenerTodos(limit, offset);
        
        // 2. Consistencia en la respuesta (estado: true, data: ...)
        res.status(200).json({ estado: true, data: pacientes });
    } catch (error) {
        next(error);
    }
};

export const obtenerPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const paciente = await pacientesService.obtenerPorId(id);
        
        if (!paciente || paciente.length === 0) {
            return res.status(404).json({ estado: false, mensaje: 'Paciente no encontrado' });
        }
        
        // Consistencia en la respuesta
        res.status(200).json({ estado: true, data: paciente });
    } catch (error) {
        next(error);
    }
};

export const actualizar = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // 3. IMPLEMENTACIÓN DEL DTO DE ENTRADA
        // Filtramos estrictamente los datos, ignorando cualquier otro campo malicioso del body
        const dtoActualizar = {
            apellido: req.body.apellido,
            nombres: req.body.nombres,
            email: req.body.email
        }; 
        
        // Pasamos el DTO limpio al servicio
        await pacientesService.actualizar(id, dtoActualizar);
        
        res.status(200).json({ 
            estado: true, 
            mensaje: 'Datos del paciente actualizados con éxito' 
        });
    } catch (error) {
        // 4. CAPTURA DE ERRORES DE MYSQL (Duplicados)
        if (error.code === 'ER_DUP_ENTRY' || (error.message && error.message.includes('Duplicate entry'))) {
            if (error.message.includes('email')) {
                return res.status(400).json({ estado: false, mensaje: 'El email ingresado ya se encuentra registrado por otro usuario' });
            }
            if (error.message.includes('documento')) {
                return res.status(400).json({ estado: false, mensaje: 'El documento ingresado ya se encuentra registrado' });
            }
            return res.status(400).json({ estado: false, mensaje: 'El registro contiene datos que ya existen en el sistema' });
        }
        
        next(error);
    }
};

export const subirFoto = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        if (!req.file) {
            return res.status(400).json({ estado: false, mensaje: 'No se adjuntó foto' });
        }

        const nombreArchivo = await pacientesService.subirFoto(id, req.file.filename);

        res.status(200).json({ 
            estado: true, 
            mensaje: 'Foto subida con éxito',
            foto: nombreArchivo 
        });

    } catch (error) {
        next(error); 
    }
};

export const eliminar = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        await pacientesService.eliminar(id);
        
        res.status(200).json({ 
            estado: true, 
            mensaje: 'Paciente eliminado (desactivado) con éxito' 
        });
    } catch (error) {
        next(error);
    }
};

export const actualizarObraSocial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id_obra_social } = req.body; 
        
        if (!id_obra_social) {
            return res.status(400).json({ estado: false, mensaje: 'Falta proveer el id_obra_social' });
        }

        await pacientesService.actualizarObraSocial(id, id_obra_social);
        
        res.status(200).json({ 
            estado: true, 
            mensaje: 'Obra social del paciente actualizada con éxito' 
        });
    } catch (error) {
        next(error);
    }
};