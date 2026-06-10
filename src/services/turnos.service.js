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

// 1. Listar turnos propios (con Paginación)
export const obtenerTurnosPropios = async (id_usuario, rol, limit, offset) => {
    let turnos;
    const numeroRol = Number(rol);

    if (numeroRol === 1) {
        // Le pasamos limit y offset al modelo
        turnos = await turnosData.obtenerTurnosPorUsuarioMedico(id_usuario, limit, offset);
    } else if (numeroRol === 2) {
        turnos = await turnosData.obtenerTurnosPorUsuarioPaciente(id_usuario, limit, offset);
    } else if (numeroRol === 3) {
        turnos = await turnosData.obtenerTodos(limit, offset);
    } else {
        throw new Error("Rol no válido para consultar turnos");
    }
    
    // Usamos .map() para aplicarle la transformación DTO a todo el arreglo de turnos
    return turnos.map(formatTurnoDTO);
};

// 2. Listar TODOS los turnos (Necesario para el controlador del admin)
export const obtenerTodos = async (limit, offset) => {
    const turnos = await turnosData.obtenerTodos(limit, offset);
    return turnos.map(formatTurnoDTO);
};

// 3. Obtener por ID
export const obtenerPorId = async (id) => {
    const turnos = await turnosData.obtenerPorId(id);

    if (turnos && turnos.length > 0) {
        // Extraemos el primer objeto y lo formateamos
        return formatTurnoDTO(turnos[0]); 
    }
    return null; 
};

// 4. Crear turno (Lógica de negocio y cálculo de valor)
export const crearTurno = async (datos) => {
    const { id_medico, id_paciente, fecha_hora } = datos;

    // Buscamos la obra social del paciente
    const pacientes = await turnosData.obtenerObraSocialPaciente(id_paciente);
    if (!pacientes || pacientes.length === 0) throw new Error("Paciente no encontrado");
    const id_obra_social = pacientes[0].id_obra_social;

    // Buscamos el valor de la consulta del médico
    const medicos = await turnosData.obtenerValorConsultaMedico(id_medico);
    if (!medicos || medicos.length === 0) throw new Error("Médico no encontrado");
    const precio = parseFloat(medicos[0].valor_consulta);

    // Verificamos si el médico atiende esa obra social
    const medicoObraSocial = await turnosData.verificarMedicoObraSocial(id_medico, id_obra_social);

    // REGLA DE NEGOCIO: Calcular el valor total
    let valorCalculado = precio; 
    
    if (medicoObraSocial && medicoObraSocial.length > 0) {
        const obrasSociales = await turnosData.obtenerDatosObraSocial(id_obra_social);
        
        if (obrasSociales && obrasSociales.length > 0) {
            const obraSocial = obrasSociales[0];
            
            // Aplicamos el descuento solo si no es particular
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

    const idTurnoInsertado = await turnosData.crear(nuevoTurno);
    
    return { 
        id_creado: idTurnoInsertado, 
        mensaje: "Reserva de turno registrada exitosamente",
        valor_final: valorCalculado 
    };
};

// 5. Marcar como atendido 
export const marcarComoAtendido = async (idTurno) => {
    const actualizado = await turnosData.marcarComoAtendido(idTurno);
    
    if (!actualizado) {
        throw new Error("No se pudo marcar como atendido o el turno no existe");
    }
    
    return actualizado; 
};

// 6. Eliminar (Soft Delete)
export const eliminar = async (id) => {
    return await turnosData.eliminar(id);
};