import especialidadesModel from '../models/especialidades.model.js';

// 1. BROWSE
const obtenerTodas = async () => {
    return await especialidadesModel.getAll();
};

// 2. READ
const obtenerPorId = async (id) => {
    const especialidad = await especialidadesModel.getById(id);
    
    // Verifica si el ID buscado arrojó algún resultado válido
    if (!especialidad || especialidad.length === 0) {
        throw new Error("La especialidad solicitada no existe o fue eliminada");
    }
    return especialidad[0];
};

// 3. ADD
const crear = async (datos) => {
    const especialidadExistente = await especialidadesModel.getByNombre(datos.nombre);
    
    // Evita duplicados verificando que el nombre ingresado no esté en uso.
    if (especialidadExistente.length > 0) {
        throw new Error("Error de duplicación: Ya existe una especialidad con ese nombre");
    }

    return await especialidadesModel.create(datos.nombre);
};

// 4. EDIT
const actualizar = async (id, datos) => {
    const especialidadActual = await especialidadesModel.getById(id);

    // Valida que la especialidad que se intenta modificar realmente exista.
    if (!especialidadActual || especialidadActual.length === 0) {
        throw new Error("No se puede editar: La especialidad no existe");
    }
    
    // Chequea si el usuario envió un nombre y si es distinto al que ya tenía.
    if (datos.nombre && datos.nombre !== especialidadActual[0].nombre) { 
        const nombreOcupado = await especialidadesModel.getByNombre(datos.nombre);
        
        // Verifica que el nuevo nombre no le pertenezca a otra especialidad distinta.
        if (nombreOcupado.length > 0) {
            throw new Error("El nuevo nombre ya está siendo usado por otra especialidad");
        }
    }

    return await especialidadesModel.update(id, datos.nombre);
};

// 5. DELETE: Soft delete. No borra, pone flag.
const borrar = async (id) => {
    const especialidadActual = await especialidadesModel.getById(id);

    // Confirma que la especialidad exista antes de intentar hacer el soft delete.
    if (!especialidadActual || especialidadActual.length === 0) {
        throw new Error("No se puede borrar: La especialidad no existe");
    }

    return await especialidadesModel.delete(id);
};

// Funciones para el Controlador.
export default {
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
    borrar
};