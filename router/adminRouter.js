import { Router } from 'express'
import { getMisPropiedades, crearPropiedad, editarPropiedad, actualizarPropiedad, eliminarPropiedad } from '../controllers/adminController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import upload from '../config/multer.js'

const adminRouter = Router()
adminRouter.get('/mis-propiedades', authMiddleware, getMisPropiedades)
adminRouter.post('/mis-propiedades/crear-propiedad', authMiddleware, upload.single('imagen'), crearPropiedad)
adminRouter.get('/mis-propiedades/editar/:id', authMiddleware, editarPropiedad)
adminRouter.put('/mis-propiedades/editar/:id', authMiddleware, upload.single('imagen'), actualizarPropiedad)
adminRouter.delete('/mis-propiedades/eliminar/:id', authMiddleware, eliminarPropiedad)

export default adminRouter
