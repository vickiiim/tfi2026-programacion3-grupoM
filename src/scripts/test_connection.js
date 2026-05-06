import pool from '../db/conexion.js';

export async function testConexion() {
    let con;
    try {
        con = await pool.getConnection();
        console.log("Conexión con base de datos OK");

        const [results] = await con.query(
            "SELECT NOW() AS hora_servidor, DATABASE() AS base_datos"
        );

        console.log("Datos de prueba");
        console.table(results);

        con.release();
    } catch (error) {
        console.log("Error al conectarse a la base de datos", error);
        console.error({
            codigo: error.code,
            msg: error.message
        });
        process.exit(1);
    } finally {
        if (con) con.release();
        await pool.end();
        console.log("Liberando recursos... Pool cerrado");
    }
}

testConexion();

export default testConexion;