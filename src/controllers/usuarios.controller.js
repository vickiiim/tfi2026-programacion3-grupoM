import jwt from 'jsonwebtoken';
import { 
    login as loginService, 
    registrarUsuario,
    actualizarRolUsuario,
    actualizarDatosPersonales as actualizarDatosService, 
    eliminarUsuario as eliminarUserService,             
    actualizarFoto as actualizarFotoService              
} from '../services/usuarios.service.js';

export const login = async (req, res, next) => { 
    try {
        const { email, password } = req.body;

        // Delegamos la lógica de verificación a la capa de servicios
        const datosUsuario = await loginService(email, password);

        // Generamos el token usando variables de entorno
        const token = jwt.sign(
            { 
                id_usuario: datosUsuario.id_usuario, 
                rol: datosUsuario.rol 
            },
            process.env.SECRET_KEY,
            { expiresIn: '2h' } 
        );

        return res.status(200).json({ 
            estado: true,
            mensaje: "Login exitoso", 
            token: token 
        });

    } catch (error) {
        next(error); 
    }
};

export const register = async (req, res, next) => {
    try {
        const { nombres, apellido, documento, email, password, id_obra_social } = req.body;
        
        const fotoPath = req.file ? req.file.filename : "";

        const nuevoUsuario = await registrarUsuario({
            nombres,
            apellido,
            documento,
            email,
            contrasenia: password, 
            foto_path: fotoPath,
            rol: 2,
            id_obra_social 
        });

        res.status(201).json({
            estado: true,
            mensaje: 'Paciente registrado con éxito',
            data: nuevoUsuario
        });

    } catch (error) {
        next(error); 
    }
};

export const actualizarRol = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;

        // VALIDACIÓN: Verificar si el rol es 1, 2 o 3
        if (![1, 2, 3].includes(Number(rol))) { 
            return res.status(400).json({ 
                estado: false, 
                mensaje: "El rol proporcionado no es válido. Debe ser 1, 2 o 3." 
            });
        }

        await actualizarRolUsuario(id, rol);

        res.status(200).json({
            estado: true,
            mensaje: `El rol del usuario ${id} ha sido actualizado con éxito`
        });
    } catch (error) {
        next(error);
    }
};


export const actualizarDatosPersonales = async (req, res, next) => {
    try {
        const { id } = req.params;
        const datos = req.body;

        // Llamamos al servicio usando el alias que definimos arriba
        const resultado = await actualizarDatosService(id, datos);
        
        res.status(200).json({ estado: true, ...resultado });
    } catch (error) {
        next(error);
    }
};

export const eliminarUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;

        const resultado = await eliminarUserService(id);
        
        res.status(200).json({ estado: true, ...resultado });
    } catch (error) {
        next(error);
    }
};

export const actualizarFoto = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Si usamos Multer, el archivo viene en req.file
        const nombreArchivo = req.file ? req.file.filename : null;

        if (!nombreArchivo) {
            return res.status(400).json({ estado: false, mensaje: "No se proporcionó ninguna imagen para actualizar" });
        }

        const resultado = await actualizarFotoService(id, nombreArchivo);
        
        res.status(200).json({ estado: true, ...resultado });
    } catch (error) {
        next(error);
    }
};