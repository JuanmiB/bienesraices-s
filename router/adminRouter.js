import { Router } from 'express'
import { getMisPropiedades } from '../controllers/adminController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const adminRouter = Router()
adminRouter.get('/mis-propiedades', authMiddleware, getMisPropiedades)
export default adminRouter
