const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    const status = err.status || 500;
    res.status(status).json({
        estado: false,
        error: err.message || 'Error interno del servidor',
    });
};

export default errorHandler;