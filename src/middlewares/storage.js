import multer from "multer";
import path from "path"

const upload = multer({dest: './src/uploads'})

const saveImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads'); // se almacenans
    },
    filename: (req, file, cb) => {
        if (file != null) {
            const ext = file.originalname.split('.').pop();
            cb(null, Date.now() + '.' + ext);
        }
    }
});

const validateImage = (req, file, cb) => {
    if (file && (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

export const uploadImage = multer({ storage: saveImage, fileFilter: validateImage });