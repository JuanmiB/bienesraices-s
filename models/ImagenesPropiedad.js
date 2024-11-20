import { DataTypes } from 'sequelize'
import db from '../config/db.js'

export const ImagenesPropiedad = db.define('foto', {
  url: {
    type: DataTypes.STRING(255), // Ajustado a 255 para reflejar tu SQL
    allowNull: false
  }
}, {
  timestamps: false // Sin columnas createdAt y updatedAt
})
