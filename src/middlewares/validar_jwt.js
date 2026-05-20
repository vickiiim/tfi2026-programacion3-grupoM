import jwt from 'jsonwebtoken';

const validarJWT = (req, res, next) => {

    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({
            error: 'Acceso denegado. Token no proporcionado.'
        });
    }

    const token = authHeader.replace('Bearer', '').trim();

    console.log('TOKEN RECIBIDO:', token);

    try {

        const payload = jwt.verify(
            token,
            'clave_secreta_tfi'
        );

        console.log('PAYLOAD:', payload);

        req.usuario = payload;

        next();

    } catch (error) {

        console.log('ERROR JWT:', error.message);

        return res.status(401).json({
            error: 'Token inválido o expirado.',
            detalle: error.message
        });

    }
};

export default validarJWT;