const Especialidad = require('../models/especialidades.model');

const getAll = async (req, res) => {
    try {
        const especialidades = await Especialidad.getAll();
        res.json(especialidades); // Devuelve la lista en formato JSON
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener especialidades", error });
    }
};

const deleteEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;
        await Especialidad.delete(id); // Ejecuta el Soft Delete
        res.json({ mensaje: "Especialidad eliminada correctamente (borrado lógico)" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar", error });
    }
};

module.exports = { getAll, deleteEspecialidad };