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
    
    const result = await usuariosModel.crearUsuario(datosUsuario);

    if (result.affectedRows === 0) {
        const error = new Error("No se pudo registrar el usuario en la base de datos");
        error.status = 500;
        throw error;
    }

    // Retornamos un objeto con los datos básicos del usuario creado (sin la contraseña)
    // result.insertId es un metadato que devuelve MySQL con el ID autoincremental creado
    return {
        id_usuario: result.insertId,
        nombres: datosUsuario.nombres,
        apellido: datosUsuario.apellido,
        email: datosUsuario.email,
        rol: datosUsuario.rol
    };
};

export const actualizarRolUsuario = async (id, rol) => {
    // Delegamos la actualización a la base de datos
    return await usuariosModel.actualizarRol(id, rol);
};