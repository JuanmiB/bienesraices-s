import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import passport from 'passport'
import { Usuario } from '../models/index.js'

// Configuracion para extraer jwt de cookie
const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      let token = null
      if (req && req.cookies) {
        token = req.cookies._token // Extrae el token de la cookie '_token'
      }
      return token
    }
  ]),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const usuario = await Usuario.scope('hideInfo').findByPk(jwtPayload.sub)

      if (usuario) {
        return done(null, usuario)
      } else {
        return done(null, false)
      }
    } catch (error) {
      return done(error, false)
    }
  }))

export default passport

//	•	La función configura Passport para autenticar a los usuarios mediante un JWT.
//	•	El JWT se extrae de una cookie llamada '_token'.
//	•	Luego de extraer el token, se verifica su validez usando un secreto almacenado en las variables de entorno.
//	•	Si el token es válido, busca al usuario correspondiente en la base de datos usando el ID que viene en el payload del JWT.
//	•	Si el usuario existe, lo autentica, de lo contrario, la autenticación falla.
