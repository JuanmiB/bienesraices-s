import { Usuario } from '../models/Usuario.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../helpers/token.js'
import jwt from 'jsonwebtoken'
import { sendRecoveryEmail } from '../services/email.js'

export const authentication = async (req, res) => {
  // Extraigo en email y el password del body
  const { email, password } = req.body
  console.log(req.body)

  try {
    // Buscar usuario por email
    const user = await Usuario.findOne({ where: { email } })

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    // Verificar contraseña
    const isPasswordValid = await user.verifyPassword(password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    // Generar token y configurar cookie
    const token = generateToken(user)
    res.cookie('_token', token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      domain: 'bienesraices-s.onrender.com'
    })

    // Respuesta exitosa
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Error en el proceso de autenticación:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
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
      secure: true, // process.env.NODE_ENV === 'production', // Asegura que sea HTTPS en producción
      sameSite: 'None' // Evita el envío en peticiones cross-site
    })

    // Responde con éxito o redirige al usuario a la página de login o a la página principal
    return res.status(200).json({ message: 'Sesión cerrada exitosamente' })
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    return res.status(500).json({ message: 'Error al cerrar la sesión' })
  }
}

export const recoverPassword = async (req, res) => {
  console.log(req.body)
  const { email } = req.body
  // Verificar si el mail esta en la base de datos
  if (!email) {
    return res.status(400).json({ message: 'El email es requerido' })
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } })
    if (!usuario) {
      return res.status(404).json({ message: 'El email no está registrado' })
    }
    // genero un token y lo guardo en el usuario
    // Generar un token seguro
    const recoveryToken = generateToken(usuario)
    const tokenExpiration = new Date(Date.now() + 3600 * 1000) // Expira en 1 hora

    // Guardar el token en el usuario
    usuario.recoveryToken = recoveryToken
    usuario.recoveryTokenExpiration = tokenExpiration

    await usuario.save()

    // Enviar email de recuperación (opcional, implementa `sendRecoveryEmail`)
    await sendRecoveryEmail(email, recoveryToken)

    return res.status(200).json({ message: 'Se envió un email para recuperar la contraseña' })
  } catch (error) {
    console.log('Error al recuperar la contraseña', error)
  }
  // Si no hay dar mensaje de error
}

export const resetPassword = async (req, res) => {
  const { password, token } = req.body

  if (!password || !token) {
    return res.status(400).json({ message: 'Token y nueva contraseña son requeridos' })
  }

  try {
    // Verificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Buscar al usuario correspondiente en la base de datos
    const usuario = await Usuario.findOne({ where: { id: decoded.sub } })

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Actualizar la contraseña en la base de datos
    usuario.password = hashedPassword
    usuario.recoveryToken = null
    usuario.recoveryTokenExpiration = null
    await usuario.save()

    return res.status(200).json({ message: 'Contraseña actualizada exitosamente' })
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error)
    return res.status(500).json({ message: 'Hubo un error al restablecer la contraseña' })
  }
}

export const verifyToken = async (req, res) => {
  // Obtener el token de la URL (por ejemplo, desde los parámetros de la ruta o de la query)
  const { token } = req.params // Si el token viene como parámetro de la URL, puedes usar req.params
  // const { token } = req.query // Si viene como query, puedes usar req.query

  if (!token) {
    return res.status(400).json({ message: 'No se proporcionó un token' })
  }

  try {
    // Buscar el token de recuperación en la base de datos
    const usuario = await Usuario.findOne({ where: { recoveryToken: token } })

    if (!usuario) {
      return res.status(404).json({ message: 'Token de recuperación no válido o ha expirado' })
    }

    // Verificar que el token sea válido
    // Si el token es un JWT, lo verificamos aquí (si se está usando JWT para los tokens de recuperación)
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token no válido o ha expirado' })
      }

      // Si el token es válido, podemos enviar una respuesta exitosa
      return res.status(200).json({ message: 'Token válido, puede restablecer su contraseña' })
    })
  } catch (error) {
    console.error('Error al verificar el token:', error)
    return res.status(500).json({ message: 'Hubo un error al verificar el token' })
  }
}

export const registrarUsuario = async (req, res) => {
  const { name, email, password } = req.body

  // Validar los campos requeridos
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' })
  }

  try {
    // Verificar si el usuario ya está registrado
    const usuarioExistente = await Usuario.findOne({ where: { email } })
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El email ya está registrado' })
    }

    // HASEHO DESDE EL MODELO USUARIO

    // Crear el nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre: name,
      email,
      password
    })

    console.log('Contraseña generada:')
    console.log('Contraseña en la base de datos:', nuevoUsuario.password)

    // Respuesta exitosa
    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
      }
    })
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    return res.status(500).json({ message: 'Ocurrió un error en el servidor' })
  }
}
