import pool from '../db/conexion.js';

const verificarCredenciales = async (email, password) => {
    const sql = `
        SELECT id_usuario, documento, apellido, nombres, email, rol 
        FROM usuarios 
        WHERE email = ? 
        AND contrasenia = sha2(?, 256) 
        AND activo = 1
    `;

    const [rows] = await pool.execute(sql, [email, password]);
    return rows; 
};

// Versión Transaccional: Crea el usuario y lo vincula como paciente ya que luego el Admin podrá cambiar el rol.
const crearPaciente = async (datos) => {
    const conexion = await pool.getConnection();

    try {
        await conexion.beginTransaction();

        const sqlUsuario = `
            INSERT INTO usuarios
            (
                documento,
                apellido,
                nombres,
                email,
                contrasenia,
                foto_path,
                rol,
                activo
            )
            VALUES (?, ?, ?, ?, sha2(?, 256), ?, ?, 1)
        `;

        const valoresUsuario = [
            datos.documento,
            datos.apellido,
            datos.nombres,
            datos.email,
            datos.contrasenia,
            datos.foto_path, 
            datos.rol
        ];
        

        const [resultUsuario] = await conexion.execute(sqlUsuario, valoresUsuario);
        
        const idUsuarioNuevo = resultUsuario.insertId;

        const sqlPaciente = `INSERT INTO pacientes (id_usuario, id_obra_social) VALUES (?, ?)`;
        await conexion.execute(sqlPaciente, [idUsuarioNuevo, datos.id_obra_social]);

        await conexion.commit();

        return idUsuarioNuevo;

    } catch (error) {
        await conexion.rollback();
        throw error;
    } finally {
        conexion.release();
    }
};

const actualizarRol = async (id, rol) => {
    const sql = 'UPDATE usuarios SET rol = ? WHERE id_usuario = ?';
    const [result] = await pool.execute(sql, [rol, id]);
    return result;
};

const actualizarDatosPersonales = async (idUsuario, datos) => {
    const sql = 'UPDATE usuarios SET apellido = ?, nombres = ?, email = ? WHERE id_usuario = ?';
    // Usamos execute igual que en el resto de tu archivo
    const [result] = await pool.execute(sql, [datos.apellido, datos.nombres, datos.email, idUsuario]);
    return result.affectedRows;
};

const eliminarUsuario = async (idUsuario) => {
    const sql = 'UPDATE usuarios SET activo = 0 WHERE id_usuario = ?';
    const [result] = await pool.execute(sql, [idUsuario]);
    return result.affectedRows;
};

const actualizarFoto = async (idUsuario, nombreArchivo) => {
    const sql = 'UPDATE usuarios SET foto_path = ? WHERE id_usuario = ?';
    const [result] = await pool.execute(sql, [nombreArchivo, idUsuario]); 
    return result.affectedRows;
};

export default {
    verificarCredenciales,
    crearPaciente,
    actualizarRol,
    actualizarDatosPersonales, 
    eliminarUsuario,          
    actualizarFoto             
};