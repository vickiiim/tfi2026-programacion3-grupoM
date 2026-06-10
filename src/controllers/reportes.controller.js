import * as reportesService from '../services/reportes.service.js';

const generarPDF = async (req, res, next) => {
    try {
        const { desde, hasta } = req.query;

        const pdfBuffer = await reportesService.generarReporteTurnos(desde, hasta);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="reporte_turnos.pdf"');
        res.setHeader('Content-Length', pdfBuffer.length);

        return res.status(200).send(pdfBuffer);
    } catch (error) {
        next(error);
    }
};

export default { generarPDF };
