const db = require('../config/db');

const Especialidad = {
    // 1. Listar todas las que están activas (Browse)
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM especialidades WHERE activo = 1');
        return rows;
    },

    // 2. Obtener una sola por su ID (Read)
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1', [id]);
        return rows[0];
    },

    // 3. Crear una nueva especialidad (Add)
    create: async (nombre) => {
        const [result] = await db.query('INSERT INTO especialidades (nombre, activo) VALUES (?, 1)', [nombre]);
        return result.insertId;
    },

    // 4. Modificar una especialidad existente (Edit)
    update: async (id, nombre) => {
        await db.query('UPDATE especialidades SET nombre = ? WHERE id_especialidad = ?', [nombre, id]);
    },

    // 5. BORRADO LÓGICO (Delete/Soft Delete)
    // No usamos DELETE FROM, solo cambiamos el estado a 0
    delete: async (id) => {
        await db.query('UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?', [id]);
    }
};

module.exports = Especialidad;