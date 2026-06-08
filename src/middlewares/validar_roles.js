//Administrador (Rol 3)
export const esAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(500).json({ 
            estado: false, 
            mensaje: 'Se quiere verificar el rol sin validar el token primero' 
        });
    }


    const { rol } = req.usuario;

    if (rol !== 3) {
        return res.status(403).json({ 
            estado: false, 
            mensaje: 'Acceso denegado. Se requieren privilegios de Administrador' 
        });
    }

    next();
};

// Paciente (Rol 2)
export const esPaciente = (req, res, next) => {
    if (!req.usuario) {
        return res.status(500).json({ estado: false, mensaje: 'Token no validado' });
    }
    if (req.usuario.rol !== 2) {
        return res.status(403).json({ estado: false, mensaje: 'Acceso denegado. Módulo de pacientes.' });
    }
    next();
};

// Médico (Rol 1)
export const esMedico = (req, res, next) => {
    if (!req.usuario) {
        return res.status(500).json({ estado: false, mensaje: 'Token no validado' });
    }
    if (req.usuario.rol !== 1) {
        return res.status(403).json({ estado: false, mensaje: 'Acceso denegado. Módulo de médicos.' });
    }
    next();
};