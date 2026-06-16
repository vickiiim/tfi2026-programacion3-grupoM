import { getAll, getById, create, update, remove } from '../models/obrasSociales.model.js';

const getAllObrasSociales = async (limit, offset) => {
    // 1. Recibimos limit y offset del controlador y se los pasamos al modelo
    const obrasBD = await getAll(limit, offset);
    
    return obrasBD.map(obra => ({
        id_obra_social: obra.id_obra_social,
        nombre: obra.nombre,
        descripcion: obra.descripcion,
        porcentaje_descuento: parseFloat(obra.porcentaje_descuento),
        es_particular: obra.es_particular === 1 // Lo convertimos a true/false para que quede más lindo
    }));
};

const getObraSocialById = async (id) => {
    const obraBD = await getById(id);
    if (!obraBD || obraBD.length === 0) throw { status: 404, message: 'Obra social no encontrada' };
    
    // 2. Como getById devuelve un array (rows), extraemos el primer elemento 
    const obra = obraBD; 
    
    return {
        id_obra_social: obra.id_obra_social,
        nombre: obra.nombre,
        descripcion: obra.descripcion,
        porcentaje_descuento: parseFloat(obra.porcentaje_descuento),
        es_particular: obra.es_particular === 1
    };
};

const createObraSocial = async (nombre, descripcion, porcentaje_descuento, es_particular) => {
    if (!nombre) throw { status: 400, message: 'El nombre es obligatorio' };
    const id = await create(nombre, descripcion, porcentaje_descuento, es_particular);
    
    return { id, nombre, descripcion, porcentaje_descuento, es_particular: es_particular === 1 };
};

const updateObraSocial = async (id, nombre, descripcion, porcentaje_descuento, es_particular) => {
    // Reutilizamos la función getObraSocialById para verificar si existe (¡Excelente práctica!)
    await getObraSocialById(id);
    
    if (!nombre) throw { status: 400, message: 'El nombre es obligatorio' };
    await update(id, nombre, descripcion, porcentaje_descuento, es_particular);
    
    // Retornamos el DTO de salida al vuelo
    return { id, nombre, descripcion, porcentaje_descuento, es_particular: es_particular === 1 };
};

const deleteObraSocial = async (id) => {
    // Verificamos si existe antes de borrar
    await getObraSocialById(id);
    await remove(id);
    return { message: 'Obra social eliminada correctamente' };
};

export { getAllObrasSociales, getObraSocialById, createObraSocial, updateObraSocial, deleteObraSocial };