export const esMedico = (req, res, next) => {

    console.log('USUARIO JWT:', req.usuario);

    if (!req.usuario) {

        return res.status(500).json({
            estado: false,
            mensaje: 'Token no validado'
        });

    }

    if (req.usuario.rol !== 1) {

        return res.status(403).json({
            estado: false,
            mensaje: 'Acceso denegado. Módulo de médicos.',
            rolRecibido: req.usuario.rol
        });

    }

    next();
};

export const esPaciente = (req, res, next) => {

    if (!req.usuario) {

        return res.status(500).json({
            estado: false,
            mensaje: 'Token no validado'
        });

    }

    if (req.usuario.rol !== 2) {

        return res.status(403).json({
            estado: false,
            mensaje: 'Acceso denegado. Módulo de pacientes.'
        });

    }

    next();
};

export const esAdmin = (req, res, next) => {

    if (!req.usuario) {

        return res.status(500).json({
            estado: false,
            mensaje: 'Token no validado'
        });

    }

    if (req.usuario.rol !== 3) {

        return res.status(403).json({
            estado: false,
            mensaje: 'Acceso denegado. Se requieren privilegios de Administrador'
        });

    }

    next();
};

export const validarRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(500).json({ estado: false, mensaje: 'Token no validado' });
        }
        
        // Verificamos si el rol del usuario está incluido en el arreglo de roles permitidos
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ 
                estado: false, 
                mensaje: 'Acceso denegado. No tienes los privilegios necesarios para esta acción.' 
            });
        }
        next();
    };
};