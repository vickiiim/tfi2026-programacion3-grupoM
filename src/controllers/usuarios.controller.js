import jwt from 'jsonwebtoken';
import { 
    login as loginService, 
    registrarUsuario,
    actualizarRolUsuario 
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
        // Obtenemos los datos desde el body
        const { nombres, apellido, documento, email, password } = req.body;
        
        // Si subieron una foto con multer, guardamos el nombre del archivo
        const fotoPath = req.file ? req.file.filename : null;

        // Delegamos la lógica al servicio, forzando rol: 2 (Paciente)
        const nuevoUsuario = await registrarUsuario({
            nombres,
            apellido,
            documento,
            email,
            contrasenia: password, 
            foto_path: fotoPath,
            rol: 2
        });

        // Respondemos con 201 Created
        res.status(201).json({
            estado: true,
            mensaje: 'Usuario registrado con éxito',
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