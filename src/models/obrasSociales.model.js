import pool from '../db/conexion.js';

// Listar todas las obras sociales activas
const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM obras_sociales WHERE activo = 1');
    return rows;
};

// Buscar una obra social por ID
const getById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM obras_sociales WHERE id_obra_social = ? AND activo = 1', [id]);
    return rows[0];
};

// Crear una obra social nueva
const create = async (nombre, descripcion, porcentaje_descuento, es_particular) => {
     const [result] = await pool.query(
        'INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular) VALUES (?, ?, ?, ?)',
        [nombre, descripcion, porcentaje_descuento, es_particular]
    );
    return result.insertId;
};

// Modificar una obra social
const update = async (id, nombre, descripcion, porcentaje_descuento, es_particular) => {
    const [result] = await pool.query(
        'UPDATE obras_sociales SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ? WHERE id_obra_social = ?',
        [nombre, descripcion, porcentaje_descuento, es_particular, id]
    );
    return result.affectedRows;
};

// Borrado lógico (soft delete)
const remove = async (id) => {
    const [result] = await pool.query(
        'UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?',
        [id]
    );
    return result.affectedRows;
};


export { getAll, getById, create, update, remove };
