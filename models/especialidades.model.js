import db from '../db/conexion.js';

const Especialidad = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM especialidades WHERE activo = 1');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1', [id]);
        return rows;
    },

    create: async (nombre) => {
        const [result] = await db.execute('INSERT INTO especialidades (nombre, activo) VALUES (?, 1)', [nombre]);
        return result.insertId;
    },

    update: async (id, nombre) => {
        await db.execute('UPDATE especialidades SET nombre = ? WHERE id_especialidad = ?', [nombre, id]);
    },

    delete: async (id) => {
        await db.execute('UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?', [id]);
    }
};

export default Especialidad;