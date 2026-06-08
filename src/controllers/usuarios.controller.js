import jwt from 'jsonwebtoken';
import { login as loginService } from '../services/usuarios.service.js';

export const login = async (req, res, next) => { // 1. Agregamos 'next'
    try {
        const { email, password } = req.body;

        const datosUsuario = await loginService(email, password);

        // Generamos el token
        const token = jwt.sign(
            { 
                id_usuario: datosUsuario.id_usuario, 
                rol: datosUsuario.rol 
            },
            process.env.SECRET_KEY,
            { expiresIn: '2h' } // El token caducará en 2 horas
        );

        return res.status(200).json({ 
            mensaje: "Login exitoso", 
            token: token 
        });

    } catch (error) {
        next(error); 
    }
};