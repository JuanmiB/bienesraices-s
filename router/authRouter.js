import { Router } from 'express'
import { authentication, verifyAuth, cerrarSesion } from '../controllers/authController.js'
const authRouter = Router()

authRouter.post('/acceder', authentication)
authRouter.get('/verify', verifyAuth)
authRouter.post('/logout', cerrarSesion)

export default authRouter
