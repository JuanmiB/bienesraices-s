import multer from 'multer'

const storage = multer.memoryStorage() // Almacena la imagen en memoria temporalmente
const upload = multer({ storage })

export default upload
