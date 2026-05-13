import pool from '../db/conexion.js';

export default class TurnosData {

    // Getter con la consulta base para no repetir código (Principio DRY)
    get selectBase() {
        return `
            SELECT 
                tr.id_turno_reserva AS id, 
                tr.id_medico AS medico_id, 
                tr.id_paciente AS paciente_id, 
                tr.id_obra_social AS obra_social_id, 
                tr.fecha_hora AS fecha, 
                tr.valor_total AS valor, 
                tr.atentido AS atendido
            FROM turnos_reservas tr
        `;
    }

    // 1. Listar turnos por Medico 
    async obtenerTurnosPorUsuarioMedico(id_usuario) {
        const sql = this.selectBase + `
            INNER JOIN medicos m ON tr.id_medico = m.id_medico
            WHERE m.id_usuario = ? AND tr.activo = 1
        `;
        const [turnos] = await pool.query(sql, [id_usuario]);
        return turnos;
    }

    // 2. Listar turnos por Paciente
    async obtenerTurnosPorUsuarioPaciente(id_usuario) {
        const sql = this.selectBase + `
            INNER JOIN pacientes p ON tr.id_paciente = p.id_paciente
            WHERE p.id_usuario = ? AND tr.activo = 1
        `;
        const [turnos] = await pool.query(sql, [id_usuario]);
        return turnos;
    }

    // 3. Buscar todos los turnos activos (Para Administrador)
    async obtenerTodos() {
        const sql = this.selectBase + ` WHERE tr.activo = 1 `;
        const [rows] = await pool.query(sql);
        return rows;
    }

    // 4. Buscar turno por ID
    async obtenerPorId(id) {
        const sql = this.selectBase + ` WHERE tr.id_turno_reserva = ? AND tr.activo = 1 `;
        const [rows] = await pool.query(sql, [id]);
        return rows; 
    }

    // 5. Crear nuevo turno
    async crear(nuevoTurno) {
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
    }

    // 6. Marcar turno como atendido (PUT)
    async marcarComoAtendido(id) {
        const sql = 'UPDATE turnos_reservas SET atentido = 1 WHERE id_turno_reserva = ? AND activo = 1';
        const [result] = await pool.query(sql, [id]);
        
        return result.affectedRows; 
    }

    // 7. Eliminar / Soft Delete (DELETE)
    async eliminar(id) {
        const sql = 'UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?';
        const [result] = await pool.query(sql, [id]);
        return result.affectedRows;
    }
    
}