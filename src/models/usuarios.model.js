import pool from '../db/conexion.js';

const verificarCredenciales = async (email, password) => {
    
    const sql = `
        SELECT id_usuario, documento, apellido, nombres, email, rol 
        FROM usuarios 
        WHERE email = ? 
        AND contrasenia = sha2(?, 256) 
        AND activo = 1
    `;

    const [rows] = await pool.execute(sql, [email, password]);
    return rows; 
};

export default { verificarCredenciales };