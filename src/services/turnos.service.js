import * as turnosData from '../models/turnos.model.js';

// --- Función Auxiliar DTO ---
const formatTurnoDTO = (turnoCrudo) => {
    return {
        id: turnoCrudo.id_turno_reserva,        // Renombramos desde el DTO
        medico_id: turnoCrudo.id_medico,
        paciente_id: turnoCrudo.id_paciente,
        obra_social_id: turnoCrudo.id_obra_social,
        fecha: turnoCrudo.fecha_hora,
        valor: turnoCrudo.valor_total,
        atendido: turnoCrudo.atentido === 1     // Convertimos a booleano
    };
};

export const obtenerTurnosPropios = async (id_usuario, rol) => {
    let turnos;
    const numeroRol = Number(rol);

    if (numeroRol === 1) {
        turnos = await turnosData.obtenerTurnosPorUsuarioMedico(id_usuario);
    } else if (numeroRol === 2) {
        turnos = await turnosData.obtenerTurnosPorUsuarioPaciente(id_usuario);
    } else if (numeroRol === 3) {
        turnos = await turnosData.obtenerTodos();
    } else {
        throw new Error("Rol no válido para consultar turnos");
    }
    
    // Usamos .map() para aplicarle la transformación DTO a todo el arreglo de turnos
    return turnos.map(formatTurnoDTO);
};

export const obtenerPorId = async (id) => {
    const turnos = await turnosData.obtenerPorId(id);

    if (turnos && turnos.length > 0) {
        // Extraemos el primer objeto con  y lo formateamos
        return formatTurnoDTO(turnos[0]); 
    }
    return null; 
};

export const crearTurno = async (datos) => {
    const { id_medico, id_paciente, fecha_hora } = datos;

    // 1. Buscamos la obra social del paciente a través del modelo
    const pacientes = await turnosData.obtenerObraSocialPaciente(id_paciente);
    if (!pacientes || pacientes.length === 0) throw new Error("Paciente no encontrado");
    const id_obra_social = pacientes[0].id_obra_social;

    // 2. Buscamos el valor de la consulta del médico
    const medicos = await turnosData.obtenerValorConsultaMedico(id_medico);
    if (!medicos || medicos.length === 0) throw new Error("Médico no encontrado");
    const precio = parseFloat(medicos[0].valor_consulta);

    // 3. Verificamos si el médico atiende esa obra social específica
    const medicoObraSocial = await turnosData.verificarMedicoObraSocial(id_medico, id_obra_social);

    // REGLA DE NEGOCIO: Calcular el valor total
    let valorCalculado = precio; 
    
    if (medicoObraSocial && medicoObraSocial.length > 0) {
        // 4. Buscamos los datos de la obra social
        const obrasSociales = await turnosData.obtenerDatosObraSocial(id_obra_social);
        
        if (obrasSociales && obrasSociales.length > 0) {
            const obraSocial = obrasSociales[0];
            
            // Aplicamos el descuento solo si no es la obra social "Particular" explícita
            if (obraSocial.es_particular === 0) {
                const porcentaje = parseFloat(obraSocial.porcentaje_descuento) / 100;
                valorCalculado = precio - (porcentaje * precio); 
            }
        }
    } 

    const nuevoTurno = {
        id_medico,
        id_paciente,
        id_obra_social,
        fecha_hora,
        valor_total: valorCalculado,
        atentido: 0,
        activo: 1
    };

    // 5. Finalmente, insertamos el turno
    const idTurnoInsertado = await turnosData.crear(nuevoTurno);
    
    return { 
        id_creado: idTurnoInsertado, 
        mensaje: "Reserva de turno registrada exitosamente",
        valor_final: valorCalculado 
    };
};

export const eliminar = async (id) => {
    return await turnosData.eliminar(id);
};