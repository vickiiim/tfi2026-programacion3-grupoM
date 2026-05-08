import db from '../db/conexion.js';

const Especialidad = {
    getAll: async (parametrosBusqueda = {}) => {
        const limit = parametrosBusqueda.limit || 10;
        const offset = parametrosBusqueda.offset || 0;
        const order = parametrosBusqueda.order === 'DESC' ? 'DESC' : 'ASC';
        const nombre = parametrosBusqueda.nombre || null;

        let sql = 'SELECT * FROM especialidades WHERE activo = 1';
        const valores = [];

        if (nombre) {
            sql += ' AND nombre LIKE ?';
            valores.push(`%${nombre}%`); 
        }

        sql += ` ORDER BY nombre ${order} LIMIT ? OFFSET ?`;
        valores.push(limit, offset);

        const [rows] = await db.execute(sql, valores);
        return rows;
    },


    getById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1', [id]);
        return rows;
    },

    getByNombre: async (nombre) => {
        const [rows] = await db.execute('SELECT * FROM especialidades WHERE nombre = ? AND activo = 1', [nombre]);
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