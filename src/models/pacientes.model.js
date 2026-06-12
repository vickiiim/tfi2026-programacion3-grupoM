import pool from '../db/conexion.js';

// 1. Agregamos limit y offset para la paginación
export const obtenerTodos = async (limit, offset) => {
    const sql = 'SELECT * FROM v_pacientes LIMIT ? OFFSET ?'; 
    // Usamos pool.execute pasando los parámetros numéricos de forma segura
    const [rows] = await pool.execute(sql, [Number(limit), Number(offset)]);
    return rows;
};

// 2. Cambiamos query por execute en todas las consultas parametrizadas
export const obtenerPorId = async (id) => {
    const sql = 'SELECT * FROM v_pacientes WHERE id_paciente = ?';
    const [rows] = await pool.execute(sql, [id]);
    return rows;
};

export const actualizar = async (idUsuario, datos) => {
    const sql = 'UPDATE usuarios SET apellido = ?, nombres = ?, email = ? WHERE id_usuario = ?';
    const [result] = await pool.execute(sql, [datos.apellido, datos.nombres, datos.email, idUsuario]);
    return result.affectedRows;
};

export const actualizarFoto = async (idUsuario, nombreArchivo) => {
    const sql = 'UPDATE usuarios SET foto_path = ? WHERE id_usuario = ?';
    const [result] = await pool.execute(sql, [nombreArchivo, idUsuario]); 
    
    return result.affectedRows;
};

export const eliminar = async (idUsuario) => {
    const sql = 'UPDATE usuarios SET activo = 0 WHERE id_usuario = ?';
    const [result] = await pool.execute(sql, [idUsuario]);
    return result.affectedRows;
};

export const actualizarObraSocial = async (idPaciente, idObraSocial) => {
    const sql = 'UPDATE pacientes SET id_obra_social = ? WHERE id_paciente = ?';
    const [result] = await pool.execute(sql, [idObraSocial, idPaciente]);
    return result.affectedRows;
};