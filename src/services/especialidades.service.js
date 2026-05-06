import especialidadesModel from '../models/especialidades.model.js';

// -------------------------------------------------------------------------
// Función DTO privada del servicio
const transformarEspecialidadDTO = (especialidadRaw) => {
    return {
        // Usamos los posibles nombres de campos que vengan de la base
        id: especialidadRaw.id_especialidad || especialidadRaw.ID_ESPECIALIDAD || especialidadRaw.id, 
        nombre: especialidadRaw.nombre || especialidadRaw.NOMBRE
    };
};

// Función auxiliar para extraer los datos
const extraerFilas = (resultadoQuery) => {
    // Si no hay resultado, devolvemos un array vacío para que el .map no falle
    if (!resultadoQuery) return [];

    // Si es el formato de MySQL [filas, campos]
    if (Array.isArray(resultadoQuery) && resultadoQuery.length > 1 && Array.isArray(resultadoQuery[0])) {
        return resultadoQuery[0];
    }

    // Si ya es un array de objetos directo
    if (Array.isArray(resultadoQuery)) {
        return resultadoQuery;
    }

    // Si es un objeto suelto (por ejemplo de un insert), lo envolvemos en array
    return [resultadoQuery];
};

// -------------------------------------------------------------------------

// 1. BROWSE
const obtenerTodas = async () => {
    const resultado = await especialidadesModel.getAll();
    const rows = extraerFilas(resultado);
    
    return rows.map(transformarEspecialidadDTO);
};

// 2. READ
const obtenerPorId = async (id) => {
    const resultado = await especialidadesModel.getById(id);
    const rows = extraerFilas(resultado);
    
    // Si no hay nada en el array
    if (!rows || rows.length === 0) {
        throw new Error("Especialidad no encontrada");
    }
    
    // Le pasamos al DTO solo el primer objeto del array
    return transformarEspecialidadDTO(rows[0]); 
};

// 3. ADD
const crear = async (datos) => {
    const resultadoExistente = await especialidadesModel.getByNombre(datos.nombre);
    const rowsExistente = extraerFilas(resultadoExistente);
    
    if (rowsExistente.length > 0) {
        throw new Error("Error de duplicación: Ya existe una especialidad con ese nombre");
    }

    const resultadoInsert = await especialidadesModel.create(datos.nombre);
    return extraerFilas(resultadoInsert); 
};

// 4. EDIT
const actualizar = async (id, datos) => {
    const resultadoData = await especialidadesModel.getById(id);
    const rowsData = extraerFilas(resultadoData);

    if (!rowsData || rowsData.length === 0) {
        throw new Error("Especialidad no encontrada: No se puede editar porque no existe");
    }

    // Si extraerFilas devolvió el array, tomamos el primer elemento
    const especialidadActual = Array.isArray(rowsData) ? rowsData[0] : rowsData; 
    
    if (datos.nombre && datos.nombre !== especialidadActual.nombre) { 
        const resultadoOcupado = await especialidadesModel.getByNombre(datos.nombre);
        const nombreOcupado = extraerFilas(resultadoOcupado);
        
        if (nombreOcupado.length > 0) {
            throw new Error("El nuevo nombre ya existe y está siendo usado por otra especialidad");
        }
    }

    const resultadoUpdate = await especialidadesModel.update(id, datos.nombre);
    return extraerFilas(resultadoUpdate);
};

// 5. DELETE
const borrar = async (id) => {
    const resultadoActual = await especialidadesModel.getById(id);
    const rowsActual = extraerFilas(resultadoActual);

    if (!rowsActual || rowsActual.length === 0) {
        throw new Error("Especialidad no encontrada: No se puede borrar porque no existe");
    }

    const resultadoDelete = await especialidadesModel.delete(id);
    return extraerFilas(resultadoDelete);
};

export default {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    borrar
};