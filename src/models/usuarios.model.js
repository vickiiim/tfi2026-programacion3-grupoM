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

// Versión corregida (foto_path y sha2 aplicados)
const crearUsuario = async (datos) => {
    const {
        nombres,
        apellido,
        documento,
        email,
        contrasenia,
        foto_path, 
        rol
    } = datos;

    const sql = `
        INSERT INTO usuarios
        (
            nombres,
            apellido,
            documento,
            email,
            contrasenia,
            foto_path,
            rol,
            activo
        )
        VALUES (?, ?, ?, ?, sha2(?, 256), ?, ?, 1)
    `;

    const [result] = await pool.execute(sql, [
        nombres,
        apellido,
        documento,
        email,
        contrasenia,
        foto_path, 
        rol
    ]);

    return result;
};

const actualizarRol = async (id, rol) => {
    const sql = 'UPDATE usuarios SET rol = ? WHERE id_usuario = ?';
    const [result] = await pool.execute(sql, [rol, id]);
    return result;
};

export default {
    verificarCredenciales,
    crearUsuario,
    actualizarRol
};
