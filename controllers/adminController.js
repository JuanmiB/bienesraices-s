import { Propiedad, Categoria, Precio, ImagenesPropiedad } from '../models/index.js'

export const getMisPropiedades = async (req, res) => {
  try {
    const { sub: id } = req.user

    const propiedad = await Propiedad.findAll({
      where: {
        usuarioId: id
      },
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Precio, as: 'precio' },
        { model: ImagenesPropiedad, as: 'foto' }
      ]
    })

    res.status(200).json({ propiedad })
  } catch (error) {
    console.error('Error al obtener las propiedades:', error)
    res.status(500).json({ message: 'Hubo un error al obtener las propiedades' })
  }
}
