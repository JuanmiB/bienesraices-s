import { Usuario } from '../models/Usuario.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../helpers/token.js'
import jwt from 'jsonwebtoken'

export const authentication = async (req, res) => {
  // Extraigo en email y el password del body
  const { email, password } = req.body
  // Busco el usuario en la base de datos con el email
  const user = await Usuario.findOne({ where: { email } })

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user)
    res.cookie('_token', token, { httpOnly: true })
    console.log(user)

    res.status(200).json({ token, user })
  } else {
    res.status(401).json({ message: 'Error en el email o contraseña' })
  }
}
// authController.js
export const verifyAuth = async (req, res) => {
  const token = req.cookies ? req.cookies._token : null

  if (!token) {
    return res.status(401).json({ message: 'No autenticado' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.status(200).json({ authenticated: true, user: decoded })
  } catch (error) {
    res.status(401).json({ authenticated: false, message: 'Token no válido o expirado' })
  }
}

export const cerrarSesion = async (req, res) => {
  try {
    // Borra la cookie del token para cerrar la sesión
    res.clearCookie('_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Asegura que sea HTTPS en producción
      sameSite: 'None' // Evita el envío en peticiones cross-site
    })

    // Responde con éxito o redirige al usuario a la página de login o a la página principal
    return res.status(200).json({ message: 'Sesión cerrada exitosamente' })
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    return res.status(500).json({ message: 'Error al cerrar la sesión' })
  }
}
