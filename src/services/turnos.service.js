import TurnosData from '../models/turnos.model.js'; 
import pool from '../db/conexion.js';

const turnosData = new TurnosData();

export default class TurnosService {

    async obtenerTurnosPropios(id_usuario, rol) {
        let turnos;
        
        const numeroRol = Number(rol);

    if (numeroRol === 1) {
            // Es un médico
            turnos = await turnosData.obtenerTurnosPorUsuarioMedico(id_usuario);
        } else if (numeroRol === 2) {
            // Es un paciente
            turnos = await turnosData.obtenerTurnosPorUsuarioPaciente(id_usuario);
        } else if (numeroRol === 3) {
            //Es un administrador, ve todos los turnos
            turnos = await turnosData.obtenerTodos();
        } else {
            throw new Error("Rol no válido para consultar turnos");
        }
        
        return turnos;
    }

      async obtenerPorId(id) {
        const turnos = await turnosData.obtenerPorId(id);

        if (turnos && turnos.length > 0) {
            return turnos; 
        }
        return null; 
    }

     async crearTurno(datos) {
        const { id_medico, id_paciente, fecha_hora } = datos;

        const [pacientes] = await pool.query('SELECT id_obra_social FROM pacientes WHERE id_paciente = ?', [id_paciente]);
        if (pacientes.length === 0) throw new Error("Paciente no encontrado");
        const [paciente] = pacientes;
        const id_obra_social = paciente.id_obra_social;

        const [medicos] = await pool.query('SELECT valor_consulta FROM medicos WHERE id_medico = ?', [id_medico]);
        if (medicos.length === 0) throw new Error("Médico no encontrado");
        const [medico] = medicos; 
        const precio = parseFloat(medico.valor_consulta);

        // Verificar si el médico atiende esa obra social específica
        const [medicoObraSocial] = await pool.query(
            'SELECT * FROM medicos_obras_sociales WHERE id_medico = ? AND id_obra_social = ? AND activo = 1', 
            [id_medico, id_obra_social]
        );

        // REGLA DE NEGOCIO: Calcular el valor total
        let valorCalculado = precio; // Por defecto arranca en el 100% del valor (Particular)
        
        // Si el arreglo 'medicoObraSocial' tiene datos, significa que el médico acepta su obra social
        if (medicoObraSocial.length > 0) {
            const [obrasSociales] = await pool.query('SELECT porcentaje_descuento, es_particular FROM obras_sociales WHERE id_obra_social = ?', [id_obra_social]);
            const [obraSocial] = obrasSociales;

            // Aplicamos el descuento solo si no es la obra social "Particular" explícita
            if (obraSocial && obraSocial.es_particular === 0) {
                const porcentaje = parseFloat(obraSocial.porcentaje_descuento) / 100;
                valorCalculado = precio - (porcentaje * precio); 
            }
        } 
        // Si medicoObraSocial está vacío, el IF se ignora y el paciente paga el precio completo.

        const nuevoTurno = {
            id_medico,
            id_paciente,
            id_obra_social,
            fecha_hora,
            valor_total: valorCalculado,
            atentido: 0,
            activo: 1
        };

        const idTurnoInsertado = await turnosData.crear(nuevoTurno);
        
        return { 
            id_creado: idTurnoInsertado, 
            mensaje: "Reserva de turno registrada exitosamente",
            valor_final: valorCalculado 
        };
    }

    async eliminar(id) {
        return await turnosData.eliminar(id);
    }
}