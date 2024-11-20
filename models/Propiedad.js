import { DataTypes } from 'sequelize'
import db from '../config/db.js'

export const Propiedad = db.define('propiedades', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  metros: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  ambientes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  dormitorios: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  banos: { // Cambiado de baños a banos
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  cochera: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  calle: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lat: {
    type: DataTypes.DECIMAL(10, 7), // Cambiado a DECIMAL
    allowNull: false
  },
  lng: {
    type: DataTypes.DECIMAL(10, 7), // Cambiado a DECIMAL
    allowNull: false
  },
  publicado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: true // Añadido timestamps
})
