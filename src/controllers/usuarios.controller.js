import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {

    try {

        const {
            nombres,
            apellido,
            documento,
            email,
            password,
            id_rol
        } = req.body;

        const fotoPath =
            req.file
                ? req.file.filename
                : null;

        const salt = await bcrypt.genSalt(10);

        const passwordEncriptada =
            await bcrypt.hash(password, salt);

        console.log('Usuario a guardar:', {
            nombres,
            apellido,
            documento,
            email,
            passwordEncriptada,
            id_rol,
            fotoPath
        });

        res.status(201).json({
            mensaje: 'Usuario registrado con éxito',
            foto: fotoPath
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        console.log('LOGIN NUEVO EJECUTANDO');

        const token = jwt.sign(

            {
                id: 1,
                rol: 1
            },

            'clave_secreta_tfi',

            {
                expiresIn: '1h'
            }

        );

        res.json({
            mensaje: 'Login exitoso',
            token
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};