import multer from 'multer';
import path from 'path';

//  Config multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});

// filefilter
const upload = multer({ 
    storage, 
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        
        if (extname) {
            return cb(null, true); // Si es imagen, lo deja pasar
        } else {
            cb(new Error("Solo se permiten imágenes (jpeg, jpg, png, gif)")); 
        }
    }
});

export default upload;