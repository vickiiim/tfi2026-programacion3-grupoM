import { getAll, getById, create, update, remove } from '../models/obrasSociales.model.js';

const getAllObrasSociales = async () => {
    return await getAll();
};

const getObraSocialById = async (id) => {
    const obraSocial = await getById(id);
    if (!obraSocial) throw { status: 404, message: 'Obra social no encontrada' };
    return obraSocial;
};

const createObraSocial = async (nombre, es_particular) => {
    if (!nombre) throw { status: 400, message: 'El nombre es obligatorio' };
    const id = await create(nombre, es_particular ?? 0);
    return { id, nombre, es_particular: es_particular ?? 0 };
};

const updateObraSocial = async (id, nombre, es_particular) => {
    await getObraSocialById(id);
    if (!nombre) throw { status: 400, message: 'El nombre es obligatorio' };
    await update(id, nombre, es_particular ?? 0);
    return { id, nombre, es_particular: es_particular ?? 0 };
};

const deleteObraSocial = async (id) => {
    await getObraSocialById(id);
    await remove(id);
    return { message: 'Obra social eliminada correctamente' };
};

export { getAllObrasSociales, getObraSocialById, createObraSocial, updateObraSocial, deleteObraSocial };
