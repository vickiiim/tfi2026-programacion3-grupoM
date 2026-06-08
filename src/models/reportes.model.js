import pool from '../db/conexion.js';

// Esta función va en el MODELO
export const obtenerDatosParaReporte = async (desde = null, hasta = null) => {
    let sql = `
        SELECT 
            tr.id_turno_reserva,
            tr.fecha_hora,
            tr.valor_total,
            tr.atentido,
            u_med.apellido AS medico_apellido,
            u_med.nombres AS medico_nombres,
            e.nombre AS especialidad,
            u_pac.apellido AS paciente_apellido,
            u_pac.nombres AS paciente_nombres,
            os.nombre AS obra_social,
            os.porcentaje_descuento,
            os.es_particular
        FROM turnos_reservas tr
        JOIN medicos m ON tr.id_medico = m.id_medico
        JOIN usuarios u_med ON m.id_usuario = u_med.id_usuario
        JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        JOIN pacientes p ON tr.id_paciente = p.id_paciente
        JOIN usuarios u_pac ON p.id_usuario = u_pac.id_usuario
        JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
        WHERE tr.activo = 1
    `;

    const valores = [];
    if (desde && hasta) {
        sql += ` AND DATE(tr.fecha_hora) >= ? AND DATE(tr.fecha_hora) <= ?`;
        valores.push(desde, hasta);
    }

    sql += ` ORDER BY tr.fecha_hora DESC`;
    
    const [rows] = await pool.query(sql, valores);
    return rows;
};