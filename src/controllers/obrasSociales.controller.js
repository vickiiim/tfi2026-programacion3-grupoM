import { getAllObrasSociales, getObraSocialById, createObraSocial, updateObraSocial, deleteObraSocial } from '../services/obrasSociales.service.js';

const getAll = async (req, res, next) => {
    try {
        // Capturamos el limit y el offset desde los Query Params de la URL
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const offset = req.query.offset ? Number(req.query.offset) : 0;

        // Pasamos los parámetros de paginación al servicio
        const data = await getAllObrasSociales(limit, offset);
        
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
        // DTO armado directamente en el controlador (Enfoque elegido)
        const dtoEntrada = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            porcentaje_descuento: req.body.porcentaje_descuento,
            es_particular: req.body.es_particular ?? 0
        };
        
        const data = await createObraSocial(dtoEntrada.nombre, dtoEntrada.descripcion, dtoEntrada.porcentaje_descuento, dtoEntrada.es_particular);
        res.status(201).json({ estado: true, datos: data });
    } catch (error) { next(error); }
};

const update = async (req, res, next) => {
    try {
        // DTO armado directamente en el controlador
        const dtoEntrada = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            porcentaje_descuento: req.body.porcentaje_descuento,
            es_particular: req.body.es_particular ?? 0
        };
        
        // Pasamos los datos limpios al servicio
        const data = await updateObraSocial(req.params.id, dtoEntrada.nombre, dtoEntrada.descripcion, dtoEntrada.porcentaje_descuento, dtoEntrada.es_particular);
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