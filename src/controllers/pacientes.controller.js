import * as pacientesService from '../services/pacientes.service.js';

export const obtenerTodos = async (req, res, next) => {
    try {
        const pacientes = await pacientesService.obtenerTodos();
        res.status(200).json(pacientes);
    } catch (error) {
        next(error);
    }
};

export const obtenerPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const paciente = await pacientesService.obtenerPorId(id);
        
        if (!paciente) {
            return res.status(404).json({ estado: false, mensaje: 'Paciente no encontrado' });
        }
        
        res.status(200).json(paciente);
    } catch (error) {
        next(error);
    }
};

export const actualizar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const datos = req.body; 
        
        await pacientesService.actualizar(id, datos);
        
        res.status(200).json({ 
            estado: true, 
            mensaje: 'Datos del paciente actualizados con éxito' 
        });
    } catch (error) {
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