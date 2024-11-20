import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const secret = process.env.JWT_SECRET // La clave secreta debe ser larga y segura (mínimo 256 bits).

// Generar un ID único y seguro
export const generarId = () => crypto.randomBytes(16).toString('hex')

// Generar un JWT seguro
export function generateToken (user) {
  // Verificar que el secreto esté configurado
  if (!secret) {
    throw new Error('Falta la clave secreta JWT_SECRET en las variables de entorno.')
  }

  // Crear el payload con los datos necesarios
  const payload = {
    sub: user.id, // Identificador del usuario
    name: user.nombre // Nombre del usuario
  }

  // Configurar opciones del token
  const options = {
    algorithm: 'HS256', // Algoritmo seguro
    expiresIn: '1h' // Expiración (1 hora)
  }

  // Generar el token
  const token = jwt.sign(payload, secret, options)
  return token
}
