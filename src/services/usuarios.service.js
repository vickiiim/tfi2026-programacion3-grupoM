import usuariosModel from '../models/usuarios.model.js';

export const login = async (email, password) => {
    // El servicio le delega la consulta SQL al Modelo
    const rows = await usuariosModel.verificarCredenciales(email, password);

    if (!rows || rows.length === 0) {
        const error = new Error("Credenciales inválidas");
        error.status = 401; 
        throw error;
    }
    return rows[0]; 
};

export const registrarUsuario = async (datosUsuario) => {
    const idInsertado = await usuariosModel.crearPaciente(datosUsuario);

    if (!idInsertado) {
        const error = new Error("No se pudo registrar el paciente en la base de datos");
        error.status = 500;
        throw error;
    }

    // Retornamos un objeto con los datos básicos del usuario creado (sin la contraseña)
    return {
        id_usuario: idInsertado, 
        nombres: datosUsuario.nombres,
        apellido: datosUsuario.apellido,
        email: datosUsuario.email,
        rol: datosUsuario.rol,
        id_obra_social: datosUsuario.id_obra_social
    };
};

export const actualizarRolUsuario = async (id, rol) => {
    // Delegamos la actualización a la base de datos
    return await usuariosModel.actualizarRol(id, rol);
};


export const actualizarDatosPersonales = async (idUsuario, datos) => {
    const affectedRows = await usuariosModel.actualizarDatosPersonales(idUsuario, datos);
    
    if (affectedRows === 0) {
        const error = new Error("No se pudo actualizar. Usuario no encontrado.");
        error.status = 404;
        throw error;
    }
    
    return { mensaje: "Datos personales actualizados correctamente" };
};

export const eliminarUsuario = async (idUsuario) => {
    const affectedRows = await usuariosModel.eliminarUsuario(idUsuario);
    
    if (affectedRows === 0) {
        const error = new Error("No se pudo dar de baja. Usuario no encontrado.");
        error.status = 404;
        throw error;
    }
    
    return { mensaje: "Usuario dado de baja exitosamente" };
};

export const actualizarFoto = async (idUsuario, nombreArchivo) => {
    const affectedRows = await usuariosModel.actualizarFoto(idUsuario, nombreArchivo);
    
    if (affectedRows === 0) {
        const error = new Error("No se pudo actualizar la foto. Usuario no encontrado.");
        error.status = 404;
        throw error;
    }
    
    return { 
        mensaje: "Foto de perfil actualizada con éxito", 
        foto_path: nombreArchivo 
    };
};