
import usuariosModel from '../models/usuarios.model.js'; 

export const login = async (email, password) => {
    const rows = await usuariosModel.verificarCredenciales(email, password);

    if (!rows || rows.length === 0) {
        const error = new Error("Credenciales inválidas");
        error.status = 401; 
        throw error;
    }

    return rows[0]; 
};