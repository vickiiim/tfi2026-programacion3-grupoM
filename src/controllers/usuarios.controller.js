import jwt from 'jsonwebtoken';
import { login as loginService } from '../services/usuarios.service.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await loginService(email, password);

        if (!usuario || usuario.length === 0) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const datosUsuario = usuario[0];

        const token = jwt.sign(
            { 
                id_usuario: datosUsuario.id_usuario, 
                rol: datosUsuario.rol 
            },
            process.env.SECRET_KEY,
            { expiresIn: '2h' } // El token caducará en 2 horas
        );

        res.status(200).json({ 
            mensaje: "Login exitoso", 
            token: token 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};