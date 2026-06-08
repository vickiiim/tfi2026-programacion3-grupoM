import pool from '../db/conexion.js';

const selectBase = `
    SELECT 
        m.id_medico,
        m.id_usuario,
        m.id_especialidad,
        m.matricula,
        m.descripcion,
        m.valor_consulta,
        u.nombres,
        u.apellido,
        u.documento,
        u.email,
        e.nombre AS especialidad_nombre
    FROM medicos m
    INNER JOIN usuarios u ON m.id_usuario = u.id_usuario
    INNER JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    WHERE u.activo = 1 AND u.rol = 1
`;

export const obtenerTodos = async () => {
    const [rows] = await pool.execute(selectBase);
    return rows;
};

export const obtenerPorEspecialidad = async (idEspecialidad) => {
    const sql = selectBase + ` AND m.id_especialidad = ?`;
    const [rows] = await pool.execute(sql, [idEspecialidad]);
    return rows;
};

// Validar si el médico ya tiene esa obra social (Regla de negocio pedida por Cristian)
export const verificarAsociacion = async (idMedico, idObraSocial) => {
    const sql = `SELECT * FROM medicos_obras_sociales WHERE id_medico = ? AND id_obra_social = ? AND activo = 1`;
    const [rows] = await pool.execute(sql, [idMedico, idObraSocial]);
    return rows.length > 0;
};

// Transacción para asociar un médico a varias Obras Sociales
export const asociarObrasSociales = async (idMedico, obrasSocialesIds) => {
    const connection = await pool.getConnection(); // Pedimos una conexión exclusiva al pool
    
    try {
        await connection.beginTransaction(); // Iniciamos la transacción
        
        const sql = `INSERT INTO medicos_obras_sociales (id_medico, id_obra_social, activo) VALUES (?, ?, 1)`;
        
        // Iteramos el arreglo e insertamos uno por uno
        for (let idObraSocial of obrasSocialesIds) {
            await connection.execute(sql, [idMedico, idObraSocial]);
        }

        await connection.commit(); // Si todo salió bien, guardamos los cambios
        return true;

    } catch (error) {
        await connection.rollback(); // Si falla 1, deshacemos TODO
        throw error;
    } finally {
        connection.release(); // Siempre liberamos la conexión
    }
};

// Actualizar la especialidad de un médico
export const actualizarEspecialidad = async (idMedico, idEspecialidad) => {
    const sql = `
        UPDATE medicos 
        SET id_especialidad = ? 
        WHERE id_medico = ?
    `;
    const [result] = await pool.execute(sql, [idEspecialidad, idMedico]);
    
    // Retorna true si se modificó el registro
    return result.affectedRows > 0; 
};

export const crearMedico = async (datosMedico) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. PRIMER PASO: Actualizar el rol del usuario a 1 (Médico)
        const sqlActualizarRol = `UPDATE usuarios SET rol = 1 WHERE id_usuario = ?`;
        await connection.execute(sqlActualizarRol, [datosMedico.id_usuario]);

        // 2. SEGUNDO PASO: Insertar los datos complementarios en la tabla medicos
        const sqlInsertarMedico = `
            INSERT INTO medicos 
            (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const valoresMedico = [
            datosMedico.id_usuario,
            datosMedico.id_especialidad,
            datosMedico.matricula,
            datosMedico.descripcion,
            datosMedico.valor_consulta
        ];
        
        const [result] = await connection.execute(sqlInsertarMedico, valoresMedico);

        // 3. Confirmamos la transacción
        await connection.commit();
        
        // Retornamos el id_medico generado autoincremental
        return result.insertId;

    } catch (error) {
        // Si hay error en el UPDATE o el INSERT, deshacemos todo
        await connection.rollback();
        throw error;
    } finally {
        connection.release(); // Liberamos la conexión para no saturar el pool
    }
};