import pool from '../db/conexion.js';

const selectBase = `
    SELECT 
        tr.id_turno_reserva, 
        tr.id_medico, 
        tr.id_paciente, 
        tr.id_obra_social, 
        tr.fecha_hora, 
        tr.valor_total, 
        tr.atentido 
    FROM turnos_reservas tr
`;

// 1. Listar turnos por Medico 
export const obtenerTurnosPorUsuarioMedico = async (id_usuario) => {
    // Usamos directamente la constante selectBase
    const sql = selectBase + `
        INNER JOIN medicos m ON tr.id_medico = m.id_medico
        WHERE m.id_usuario = ? AND tr.activo = 1
    `;
    const [turnos] = await pool.query(sql, [id_usuario]);
    return turnos;
};

// 2. Listar turnos por Paciente
export const obtenerTurnosPorUsuarioPaciente = async (id_usuario) => {
    const sql = selectBase + `
        INNER JOIN pacientes p ON tr.id_paciente = p.id_paciente
        WHERE p.id_usuario = ? AND tr.activo = 1
    `;
    const [turnos] = await pool.query(sql, [id_usuario]);
    return turnos;
};

// 3. Buscar todos los turnos activos (Para Administrador)
export const obtenerTodos = async () => {
    const sql = selectBase + ` WHERE tr.activo = 1 `;
    const [rows] = await pool.query(sql);
    return rows;
};

// 4. Buscar turno por ID
export const obtenerPorId = async (id) => {
    const sql = selectBase + ` WHERE tr.id_turno_reserva = ? AND tr.activo = 1 `;
    const [rows] = await pool.query(sql, [id]);
    return rows; 
};

// 5. Crear nuevo turno
export const crear = async (nuevoTurno) => {
    const sql = `INSERT INTO turnos_reservas 
                (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido, activo) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    const valores = [
        nuevoTurno.id_medico,
        nuevoTurno.id_paciente,
        nuevoTurno.id_obra_social,
        nuevoTurno.fecha_hora,
        nuevoTurno.valor_total,
        nuevoTurno.atentido, 
        nuevoTurno.activo
    ];

    const [result] = await pool.query(sql, valores);
    
    // Retornamos el ID autoincremental generado por MySQL
    return result.insertId; 
};

// 6. Marcar turno como atendido (PUT)
export const marcarComoAtendido = async (id) => {
    const sql = 'UPDATE turnos_reservas SET atentido = 1 WHERE id_turno_reserva = ? AND activo = 1';
    const [result] = await pool.query(sql, [id]);
    
    return result.affectedRows; 
};

// 7. Eliminar / Soft Delete (DELETE)
export const eliminar = async (id) => {
    const sql = 'UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?';
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows;
};

// --- FUNCIONES AUXILIARES PARA CREAR TURNOS ---

export const obtenerObraSocialPaciente = async (idPaciente) => {
    const sql = 'SELECT id_obra_social FROM pacientes WHERE id_paciente = ?';
    const [rows] = await pool.query(sql, [idPaciente]);
    return rows; // Retorna el objeto directamente o undefined si no existe
};

export const obtenerValorConsultaMedico = async (idMedico) => {
    const sql = 'SELECT valor_consulta FROM medicos WHERE id_medico = ?';
    const [rows] = await pool.query(sql, [idMedico]);
    return rows;
};

export const verificarMedicoObraSocial = async (idMedico, idObraSocial) => {
    const sql = 'SELECT * FROM medicos_obras_sociales WHERE id_medico = ? AND id_obra_social = ? AND activo = 1';
    const [rows] = await pool.query(sql, [idMedico, idObraSocial]);
    return rows;
};

export const obtenerDatosObraSocial = async (idObraSocial) => {
    const sql = 'SELECT porcentaje_descuento, es_particular FROM obras_sociales WHERE id_obra_social = ?';
    const [rows] = await pool.query(sql, [idObraSocial]);
    return rows;
};