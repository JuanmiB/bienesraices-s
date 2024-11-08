import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'
export const Usuario = db.define('usuarios', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token: DataTypes.STRING,
  confirm: DataTypes.BOOLEAN
},
{
  // capturo al ususario y hasheo el password con bcript
  hooks: {
    beforeCreate: async function (usuario) {
      const salt = await bcrypt.genSalt(10)
      usuario.password = await bcrypt.hash(usuario.password, salt)
    }

  },
  scopes: {
    hideInfo: {
      attributes: {
        exclude: ['password', 'token', 'confirm', 'createdAt', 'updatedAt']
      }
    }
  }
})
Usuario.prototype.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}
