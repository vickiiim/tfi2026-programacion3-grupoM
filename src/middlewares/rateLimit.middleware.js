import rateLimit from 'express-rate-limit';

const rateLimitMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        estado: false,
        error: 'Demasiadas solicitudes. Intentá de nuevo en 15 minutos.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export default rateLimitMiddleware;