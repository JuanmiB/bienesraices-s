import { Sequelize } from 'sequelize'

// lecuta del archivo env y conexion con base de datos
process.loadEnvFile()

const db = new Sequelize(process.env.DB_NOMBRE, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: 3307,
  dialect: 'mysql',
  define: {
    timestamps: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
})
export default db
