import * as medicosData from '../models/medicos.model.js';

// --- DTO PURISTA ---
const formatMedicoDTO = (medicoCrudo) => {
    return {
        id: medicoCrudo.id_medico,
        matricula: medicoCrudo.matricula,
        descripcion: medicoCrudo.descripcion,
        valor_consulta: parseFloat(medicoCrudo.valor_consulta),
        usuario: {
            id: medicoCrudo.id_usuario,
            nombre: medicoCrudo.nombres,
            apellido: medicoCrudo.apellido,
            documento: medicoCrudo.documento,
            email: medicoCrudo.email
        },
        especialidad: {
            id: medicoCrudo.id_especialidad,
            nombre: medicoCrudo.especialidad_nombre
        }
    };
};

export const obtenerTodos = async () => {
    const medicos = await medicosData.obtenerTodos();
    return medicos.map(formatMedicoDTO);
};

export const obtenerPorEspecialidad = async (idEspecialidad) => {
    const medicos = await medicosData.obtenerPorEspecialidad(idEspecialidad);
    return medicos.map(formatMedicoDTO);
};

export const asociarObrasSociales = async (idMedico, obrasSocialesIds) => {
    // Regla de Negocio: Filtramos las obras sociales que ya estén asociadas a este médico
    const obrasSocialesNuevas = [];
    
    for (let idObraSocial of obrasSocialesIds) {
        const yaExiste = await medicosData.verificarAsociacion(idMedico, idObraSocial);
        if (!yaExiste) {
            obrasSocialesNuevas.push(idObraSocial);
        }
    }

    // Si todas ya existían, no hacemos la transacción y avisamos
    if (obrasSocialesNuevas.length === 0) {
        throw new Error("Todas las obras sociales enviadas ya estaban asociadas al médico");
    }

    // Ejecutamos la transacción solo con las nuevas
    await medicosData.asociarObrasSociales(idMedico, obrasSocialesNuevas);
    
    return {
        mensaje: "Asociación exitosa",
        obras_sociales_asociadas: obrasSocialesNuevas.length
    };
};

export const actualizarEspecialidad = async (idMedico, idEspecialidad) => {
    const modificado = await medicosData.actualizarEspecialidad(idMedico, idEspecialidad);
    
    // Si affectedRows fue 0, significa que el médico no existe
    if (!modificado) {
        throw new Error("No se pudo actualizar. Verifique que el ID del médico sea correcto.");
    }

    return { 
        mensaje: "La especialidad del médico se actualizó correctamente",
        id_especialidad_nueva: idEspecialidad
    };
};