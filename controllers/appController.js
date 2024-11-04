import { Propiedad, Categoria, Precio, ImagenesPropiedad } from '../models/index.js'
import { Op } from 'sequelize'

export const getHomeData = async (req, res) => {
  try {
    const categorias = await Categoria.findAll()
    res.status(200).json({ categorias })
  } catch (error) {
    console.log(error)
  }
}

// Método para buscar categorías basadas en un término de búsqueda
export const searchCategories = async (req, res) => {
  const { query } = req.query // Extrae el parámetro de búsqueda `query` de la URL

  try {
    if (!query) {
      return res.status(400).json({ message: 'Parámetro de búsqueda faltante' })
    }

    const propiedades = await Propiedad.findAll({
      where: {
        titulo: { [Op.like]: `%${query}%` } // Filtra por coincidencia parcial en el campo `nombre`
      },
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Precio, as: 'precio' },
        { model: ImagenesPropiedad, as: 'foto' }
      ]
    })

    res.status(200).json({ propiedades })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error al realizar la búsqueda de categorías' })
  }
}

export const getPropiedad = async (req, res) => {
  const { id } = req.params

  try {
    const propiedad = await Propiedad.findByPk(id, {
      include: [
        { model: Precio, as: 'precio' },
        { model: ImagenesPropiedad, as: 'foto' },
        { model: Categoria, as: 'categoria' }
      ]
    })
    res.status(200).json({ propiedad })
  } catch (error) {
    console.log(error)
  }
}
// La busqueda se hace en base la categoria clickeada
