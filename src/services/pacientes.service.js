import * as pacientesData from '../models/pacientes.model.js';

const formatPacienteDTO = (pacienteBD) => ({
    id: pacienteBD.id_paciente,
    usuarioId: pacienteBD.id_usuario,
    apellido: pacienteBD.apellido,
    nombres: pacienteBD.nombres,
    email: pacienteBD.email,
    obraSocialId: pacienteBD.id_obra_social,
    obraSocial: pacienteBD.descripcion_obra_social,
    foto: pacienteBD.foto_path
});

export const obtenerTodos = async () => {
    const pacientesBD = await pacientesData.obtenerTodos();
    return pacientesBD.map(formatPacienteDTO);
};

export const obtenerPorId = async (id) => {
    const pacienteBD = await pacientesData.obtenerPorId(id);
    
    if (pacienteBD && pacienteBD.length > 0) {
        return formatPacienteDTO(pacienteBD[0]); 
    }
    
    return null;
};

export const actualizar = async (id, datos) => {
    const pacienteBD = await pacientesData.obtenerPorId(id);
    
    if (!pacienteBD || pacienteBD.length === 0) {
        throw new Error(`No se encontró el paciente con ID: ${id}`);
    }
    
    const idUsuario = pacienteBD[0].id_usuario;
    const resultado = await pacientesData.actualizar(idUsuario, datos);
    
    if (resultado === 0) {
        throw new Error("No se pudo actualizar el paciente en la base de datos");
    }
    
    return true;
};

export const subirFoto = async (idPaciente, nombreArchivo) => {
    const pacienteBD = await pacientesData.obtenerPorId(idPaciente);
    
    if (!pacienteBD || pacienteBD.length === 0) {
        throw new Error(`No se encontró el paciente con ID: ${idPaciente}`);
    }
    
    const idUsuario = pacienteBD[0].id_usuario;
    const resultado = await pacientesData.actualizarFoto(idUsuario, nombreArchivo);
    
    if (resultado === 0) {
        throw new Error("No se pudo actualizar el registro en la base de datos");
    }
    
    return nombreArchivo;
};

export const eliminar = async (id) => {
    const pacienteBD = await pacientesData.obtenerPorId(id);
    
    if (!pacienteBD || pacienteBD.length === 0) {
        throw new Error(`No se encontró el paciente con ID: ${id}`);
    }
    
    const idUsuario = pacienteBD[0].id_usuario;
    const resultado = await pacientesData.eliminar(idUsuario);
    
    if (resultado === 0) {
        throw new Error("No se pudo eliminar el paciente de la base de datos");
    }
    
    return true;
};

export const actualizarObraSocial = async (idPaciente, idObraSocial) => {
    const pacienteBD = await pacientesData.obtenerPorId(idPaciente);
    
    if (!pacienteBD || pacienteBD.length === 0) {
        throw new Error(`No se encontró el paciente con ID: ${idPaciente}`);
    }
    
    const resultado = await pacientesData.actualizarObraSocial(idPaciente, idObraSocial);
    
    if (resultado === 0) {
        throw new Error("No se pudo actualizar la obra social en la base de datos");
    }
    
    return true;
};