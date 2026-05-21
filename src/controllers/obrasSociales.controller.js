import { getAllObrasSociales, getObraSocialById, createObraSocial, updateObraSocial, deleteObraSocial } from '../services/obrasSociales.service.js';

const getAll = async (req, res, next) => {
    try {
        const data = await getAllObrasSociales();
        res.status(200).json({ estado: true, datos: data });
    } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
    try {
        const data = await getObraSocialById(req.params.id);
        res.status(200).json({ estado: true, datos: data });
    } catch (error) { next(error); }
};

const create = async (req, res, next) => {
    try {
        const { nombre, es_particular } = req.body;
        const data = await createObraSocial(nombre, es_particular);
        res.status(201).json({ estado: true, datos: data });
    } catch (error) { next(error); }
};

const update = async (req, res, next) => {
    try {
        const { nombre, es_particular } = req.body;
        const data = await updateObraSocial(req.params.id, nombre, es_particular);
        res.status(200).json({ estado: true, datos: data });
    } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
    try {
        const data = await deleteObraSocial(req.params.id);
        res.status(200).json({ estado: true, datos: data });
    } catch (error) { next(error); }
};

export { getAll, getById, create, update, remove };