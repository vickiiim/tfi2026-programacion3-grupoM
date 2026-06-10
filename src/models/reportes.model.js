import pool from '../db/conexion.js';

export const obtenerDatosParaReporte = async (desde, hasta) => {
    const sql = `CALL sp_turnos_por_rango_fechas(?, ?)`;
    const valores = [desde, hasta];
    
    const [rows] = await pool.query(sql, valores);
    
    return rows [0]; 
};