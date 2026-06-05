import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    // Extraemos el token del formato "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[5];

    if (!token) {
        return res.status(401).json({
            estado: false,
            mensaje: 'Acceso denegado: No se proporcionó un token'
        });
    }

    try {
        const verificado = jwt.verify(
            token,
            process.env.SECRET_KEY 
        );

        req.usuario = verificado;

        next();

    } catch (error) {
        return res.status(401).json({
            estado: false,
            mensaje: 'Token no válido o expirado',
            detalle: error.message
        });
    }
};

export const tieneRol = (...rolesPermitidos) => {

    return (req, res, next) => {

        if (!req.usuario) {
            return res.status(401).json({
                estado: false,
                mensaje: 'Usuario no autenticado'
            });
        }

        // Verificamos si el rol del usuario está dentro de los roles permitidos
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                estado: false,
                mensaje: `Acceso denegado: Tu rol (${req.usuario.rol}) no tiene permiso para esta acción`
            });
        }

        next();
    };
};