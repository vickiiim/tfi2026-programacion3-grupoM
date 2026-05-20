import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    const token =
        authHeader &&
        authHeader.split(' ')[1];

    if (!token) {

        return res.status(401).json({
            mensaje: 'Acceso denegado: No se proporcionó un token'
        });

    }

    try {

        const verificado = jwt.verify(
            token,
            process.env.JWT_SECRET || 'clave_secreta_tfi'
        );

        req.user = verificado;

        next();

    } catch (error) {

        res.status(403).json({
            mensaje: 'Token no válido o expirado'
        });

    }
};

export const tieneRol = (...rolesPermitidos) => {

    return (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({
                mensaje: 'Usuario no autenticado'
            });

        }

        if (!rolesPermitidos.includes(req.user.rol)) {

            return res.status(403).json({
                mensaje: `Acceso denegado: Tu rol (${req.user.rol}) no tiene permiso para esta acción`
            });

        }

        next();
    };
};