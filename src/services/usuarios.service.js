import pool from '../db/conexion.js';

const crearUsuario = async (datos) => {
    const {
        nombres,
        apellido,
        documento,
        email,
        contrasenia,
        foto,
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
            foto,
            rol,
            activo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `;

    const [result] = await pool.execute(sql, [
        nombres,
        apellido,
        documento,
        email,
        contrasenia,
        foto,
        rol
    ]);

    return result;
};

const verificarCredenciales = async (email) => {
    const sql = `
        SELECT 
            id_usuario,
            documento,
            apellido,
            nombres,
            email,
            rol,
            contrasenia
        FROM usuarios
        WHERE email = ?
        AND activo = 1
    `;

    const [rows] = await pool.execute(sql, [email]);

    return rows;
};

export default {
    crearUsuario,
    verificarCredenciales
};