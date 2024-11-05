import { Router } from 'express'
import { authentication, verifyAuth, cerrarSesion, login } from '../controllers/authController.js'
const authRouter = Router()

authRouter.get('/acceder', login)
authRouter.post('/acceder', authentication)
authRouter.get('/verify', verifyAuth)
authRouter.post('/logout', cerrarSesion)

export default authRouter
