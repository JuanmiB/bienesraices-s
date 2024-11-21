import { Propiedad, Categoria, Precio, ImagenesPropiedad, Usuario } from '../models/index.js'
import { Op, where, Sequelize } from 'sequelize'

export const getHomeData = async (req, res) => {
  try {
    const categorias = await Categoria.findAll()
    res.status(200).json({ categorias })
  } catch (error) {
    console.log(error)
  }
}

export const getUsuario = async (req, res) => {
  try {
    const { id } = req.params // Obtener el ID del usuario desde los parámetros de la URL

    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findByPk(id)

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // Enviar el usuario como respuesta
    res.json(usuario)
  } catch (error) {
    console.error('Error al obtener el usuario:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
// <-----------NO SE USAAAA
// Método para buscar categorías basadas en un término de búsqueda
export const searchCategories = async (req, res) => {
  const { query } = req.query // Extrae el parámetro de búsqueda `query` de la URL

  try {
    if (!query) {
      return res.status(400).json({ message: 'Parámetro de búsqueda faltante' })
    }

    // ESTA BUSCANDO EN TITULO< NO EN CATEGORIAS
    const propiedades = await Propiedad.findAll({
      where: {
        titulo: { [Op.like]: `%${query}%` } // Filtra por coincidencia parcial en el campo `nombre`
      },
      // esto esta raro comparado con la bd
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Precio, as: 'precio' },
        { model: ImagenesPropiedad, as: 'foto' },
        { model: Usuario, as: 'usuario' }

      ]
    })

    res.status(200).json({ propiedades })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error al realizar la búsqueda de categorías' })
  }
}

export const getById = async (req, res) => {
  const { id } = req.params
  console.log(id)

  try {
    // Busca todas las propiedades cuyo categoriaId sea igual al id proporcionado
    const propiedadCategorias = await Propiedad.findAll({
      where: { categoriaId: id }, // Filtra por categoriaId
      include: [
        {
          model: Categoria, // Relación con Categoría
          attributes: ['id', 'name'] // Obtiene solo los atributos 'id' y 'name' de la categoría
        },
        {
          model: Precio, // Relación con Precio
          as: 'precio'
        },
        {
          model: ImagenesPropiedad, // Relación con Imágenes de la Propiedad
          as: 'foto'
        },
        {
          model: Usuario, // Relación con Usuario
          as: 'usuario'
        }
      ]
    })

    // Si no se encuentran propiedades, se devuelve un error
    if (propiedadCategorias.length === 0) {
      return res.status(404).json({ message: 'No se encontraron propiedades para esta categoría' })
    }

    // Retorna las propiedades encontradas
    return res.status(200).json({ propiedades: propiedadCategorias })
  } catch (error) {
    console.error('Error al obtener propiedades por categoría:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
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

export const getCategorias = async (req, res) => {
  console.log(req.cookies)
  console.log('Encabezados recibidos:', req.headers)
  try {
    const categorias = await Categoria.findAll()
    res.json({ categorias })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener las categorias' })
  }
}

export const buscar = async (req, res) => {
  const { query, category } = req.query
  console.log(query, category)

  try {
    // Busca la categoría por nombre
    const originalCategoryName = category.replace(/-/g, ' ')
    console.log('Categoría formateada para búsqueda:', originalCategoryName)

    const categoria = category
      ? await Categoria.findOne({
        where: {
          name: originalCategoryName.trim() // Eliminamos espacios extra
        }
      })
      : null

    if (categoria) {
      console.log('Categoría encontrada:', categoria)
    } else {
      console.log('Categoría no encontrada')
    }

    // Construimos las condiciones de búsqueda dinámicamente
    const condiciones = {
      where: {
        [Op.and]: []
      },
      include: [
        { model: Categoria, as: 'categoria', attributes: ['id', 'name'] },
        { model: Precio, as: 'precio' },
        { model: ImagenesPropiedad, as: 'foto' },
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] }
      ]
    }

    // Si existe query, lo añadimos como una condición
    if (query) {
      condiciones.where[Op.and].push({
        [Op.or]: [
          { titulo: { [Op.like]: `%${query}%` } }
        ]
      })
    }

    // Si existe categoria y la encontramos, la añadimos como condición
    if (categoria) {
      condiciones.where[Op.and].push({
        categoriaId: categoria.id
      })
    }

    // Si no hay condiciones, eliminamos el operador Op.and
    if (condiciones.where[Op.and].length === 0) {
      delete condiciones.where[Op.and]
    }

    console.log('Condiciones de búsqueda:', condiciones)

    // Buscamos las propiedades en la base de datos
    const resultados = await Propiedad.findAll(condiciones)

    if (resultados.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron resultados para la búsqueda'
      })
    }

    res.json({
      success: true,
      data: resultados
    })
  } catch (error) {
    console.error('Error en la búsqueda:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}
export const buscarPorCategoria = async (req, res) => {
  const { category } = req.query
  console.log('Buscando por categoría:', category)

  try {
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro "category" es obligatorio.'
      })
    }

    const originalCategoryName = category.replace(/-/g, ' ')
    console.log('Categoría formateada para búsqueda:', originalCategoryName)

    // Busca la categoría por nombre
    const categoria = await Categoria.findOne({
      where: {
        name: originalCategoryName.trim() // Eliminamos espacios extra
      }
    })

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada.'
      })
    }

    // Busca las propiedades de la categoría
    const propiedades = await Propiedad.findAll({
      where: {
        categoriaId: categoria.id
      },
      include: [
        { model: Categoria, as: 'categoria', attributes: ['id', 'name'] },
        { model: Precio, as: 'precio' },
        { model: ImagenesPropiedad, as: 'foto' },
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] }
      ]
    })

    if (propiedades.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron propiedades en esta categoría.'
      })
    }

    res.json({
      success: true,
      data: propiedades
    })
  } catch (error) {
    console.error('Error en la búsqueda por categoría:', error)
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    })
  }
}
