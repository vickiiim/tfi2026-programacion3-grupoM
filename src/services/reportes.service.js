import PDFDocument from 'pdfkit';
import * as turnosModel from '../models/reportes.model.js';

export const generarReporteTurnos = async (desde = null, hasta = null) => {
    
    const rows = await turnosModel.obtenerDatosParaReporte(desde, hasta);

    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));

    return new Promise((resolve, reject) => {
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        const fechaEmision = new Date().toLocaleDateString('es-AR', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        doc.fontSize(18).font('Helvetica-Bold').text('Reporte de Turnos', { align: 'center' });
        doc.fontSize(10).font('Helvetica').text(`Generado el: ${fechaEmision}`, { align: 'center' });
        doc.moveDown();

        if (desde && hasta) {
            doc.fontSize(10).text(`Período: ${desde} al ${hasta}`, { align: 'center' });
            doc.moveDown();
        }

        doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        if (rows.length === 0) {
            doc.fontSize(12).text('No se encontraron turnos para el período seleccionado.', { align: 'center' });
        } else {
            const tableTop = doc.y;
            // Coordenadas X optimizadas para que no se superpongan los textos
            const colPositions = [40, 75, 170, 260, 350, 440, 510]; 
            const colHeaders = ['ID', 'Fecha y Hora', 'Médico', 'Especialidad', 'Paciente', 'O. Social', 'Valor'];

            doc.fontSize(8).font('Helvetica-Bold');
            colHeaders.forEach((header, i) => {
                doc.text(header, colPositions[i], tableTop, { width: 85, align: 'left' });
            });

            doc.moveTo(40, doc.y + 2).lineTo(550, doc.y + 2).stroke();
            doc.moveDown(0.5);

            let totalGeneral = 0;
            let atendidos = 0;
            let pendientes = 0;

            doc.font('Helvetica').fontSize(7);

            for (const turno of rows) {
                // REGLA CRUCIAL PARA PDFKIT: Guardamos el 'y' del inicio de la fila
                const yFilas = doc.y;

                if (yFilas > 720) {
                    doc.addPage();
                }

                const fechaFormateada = new Date(turno.fecha_hora).toLocaleString('es-AR', {
                    timeZone: 'America/Argentina/Buenos_Aires', 
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });

                const medico = `${turno.medico_apellido}, ${turno.medico_nombres}`.substring(0, 18);
                const paciente = `${turno.paciente_apellido}, ${turno.paciente_nombres}`.substring(0, 18);
                const valor = `$${parseFloat(turno.valor_total).toFixed(2)}`;

                doc.text(String(turno.id_turno_reserva), colPositions[0], yFilas, { width: 30 });
                doc.text(fechaFormateada, colPositions[1], yFilas, { width: 90 }); 
                doc.text(medico, colPositions[2], yFilas, { width: 85 });
                doc.text(turno.especialidad.substring(0, 14), colPositions[3], yFilas, { width: 85 });
                doc.text(paciente, colPositions[4], yFilas, { width: 80 });
                doc.text(turno.obra_social.substring(0, 12), colPositions[5], yFilas, { width: 65 });
                doc.text(valor, colPositions[6], yFilas, { width: 40, align: 'right' });

                totalGeneral += parseFloat(turno.valor_total);
                if (turno.atentido === 1 || turno.atendido === 1) atendidos++;
                else pendientes++;

                // Le decimos a PDFKit que avance el renglón de manera controlada para la siguiente vuelta
                doc.moveDown(1.2);
            }

            doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown();

            doc.fontSize(10).font('Helvetica-Bold');
            doc.text(`Total General: $${totalGeneral.toFixed(2)}`, { align: 'right' });
            doc.moveDown(0.5);

            doc.fontSize(9).font('Helvetica');
            doc.text(`Turnos Atendidos: ${atendidos}    |    Pendientes: ${pendientes}    |    Total Turnos: ${rows.length}`);
        }

        doc.end();
    });
};