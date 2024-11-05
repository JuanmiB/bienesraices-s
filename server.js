import express, { urlencoded, json } from 'express'
import passport from './config/passport.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import csurf from 'csurf'
import db from './config/db.js'
import appRoute from './router/appRouter.js'
import authRouter from './router/authRouter.js'
import adminRouter from './router/adminRouter.js'
import identifyUser from './middleware/identifyUser.js'
const app = express()

app.use(json())
app.disable('x-powered-by')

// middleware -> lectura de formularo con true para un formato de objetos
app.use(urlencoded({ extended: true }))

app.use(cors({
  origin: 'https://bienesraices-react.netlify.app',
  credentials: true // Permitir cookies y credenciales en la solicitud
}))

// Middleware -> Uso de la configuracion de passport
app.use(passport.initialize())

// Habilitacion de lectua de cookies
app.use(cookieParser())

// Habilitacion de CSRF
// app.use(csurf({ cookie: true }))

// app.use(identifyUser)

// Conexion BD
try {
  await db.authenticate()
  db.sync()
  console.log('Conexion correcta')
} catch (error) {
  console.log(error)
}

// Routing
app.use('/', appRoute)
app.use('/auth', authRouter)
app.use('/admin', adminRouter)

const PORT = process.env.PORT || 1234
app.listen(PORT, () => {
  console.log(`DOMINIO: http://localhost:${PORT}`)
})
