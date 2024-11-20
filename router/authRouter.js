import { Router } from 'express'
import { authentication, verifyAuth, cerrarSesion, recoverPassword, resetPassword, verifyToken, registrarUsuario } from '../controllers/authController.js'
const authRouter = Router()

authRouter.post('/acceder', authentication)
authRouter.get('/verify', verifyAuth)
authRouter.post('/logout', cerrarSesion)
authRouter.post('/register', registrarUsuario)
authRouter.post('/recover-password', recoverPassword)
authRouter.get('/reset-password/:token', verifyToken)
authRouter.post('/reset-password/:token', resetPassword)

export default authRouter
