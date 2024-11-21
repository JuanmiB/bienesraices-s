import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const secret = process.env.JWT_SECRET

export const generarId = () => crypto.randomBytes(16).toString('hex')

// Generar un JWT seguro
export function generateToken (user) {
  if (!secret) {
    throw new Error('Falta la clave secreta JWT_SECRET en las variables de entorno.')
  }

  // payload con datos del user
  const payload = {
    sub: user.id,
    name: user.nombre
  }

  // Configuracion del  del token
  const options = {
    algorithm: 'HS256',
    expiresIn: '1h'
  }

  // Generar el token
  const token = jwt.sign(payload, secret, options)
  return token
}
