import pool from '../db/conexion.js';

export const obtenerTodos = async () => {
    const sql = 'SELECT * FROM v_pacientes'; 
    const [rows] = await pool.query(sql);
    return rows;
};

export const obtenerPorId = async (id) => {
    const sql = 'SELECT * FROM v_pacientes WHERE id_paciente = ?';
    const [rows] = await pool.query(sql, [id]);
    return rows;
};

export const actualizar = async (idUsuario, datos) => {
    const sql = 'UPDATE usuarios SET apellido = ?, nombres = ?, email = ? WHERE id_usuario = ?';
    const [result] = await pool.query(sql, [datos.apellido, datos.nombres, datos.email, idUsuario]);
    return result.affectedRows;
};

export const actualizarFoto = async (idUsuario, nombreArchivo) => {
    const sql = 'UPDATE usuarios SET foto_path = ? WHERE id_usuario = ?';
    const [result] = await pool.query(sql, [nombreArchivo, idUsuario]); 
    
    return result.affectedRows;
};

export const eliminar = async (idUsuario) => {
    const sql = 'UPDATE usuarios SET activo = 0 WHERE id_usuario = ?';
    const [result] = await pool.query(sql, [idUsuario]);
    return result.affectedRows;
};

export const actualizarObraSocial = async (idPaciente, idObraSocial) => {
    const sql = 'UPDATE pacientes SET id_obra_social = ? WHERE id_paciente = ?';
    const [result] = await pool.query(sql, [idObraSocial, idPaciente]);
    return result.affectedRows;
};