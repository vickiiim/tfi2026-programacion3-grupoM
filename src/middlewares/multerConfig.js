import multer from 'multer';

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, 'uploads/');
    },

    filename: (req, file, cb) => {

        const nombreArchivo =
            Date.now() + '-' + file.originalname;

        cb(null, nombreArchivo);
    }

});

const fileFilter = (req, file, cb) => {

    const tiposPermitidos = [
        'image/jpeg',
        'image/png',
        'image/jpg'
    ];

    if (tiposPermitidos.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error('Solo se permiten imágenes JPG, JPEG o PNG'),
            false
        );

    }
};

const upload = multer({
    storage,
    fileFilter
});

export default upload;