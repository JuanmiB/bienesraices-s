import { Propiedad, Categoria, Precio, ImagenesPropiedad } from '../models/index.js'
import { propiedadSchema } from '../schema/propieadad.schema.js'
import cloudinary from '../config/cloudinary.js'

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

export const crearPropiedad = async (req, res) => {
  try {
    const { sub: id } = req.user
    console.log('Identificador del usuario', id)
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' })
    }

    // Subir la imagen a Cloudinary usando el buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'propiedades' }, // Opcional: Carpeta donde guardar las imágenes
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }
      )

      // Pasar el buffer al stream
      uploadStream.end(req.file.buffer)
    })

    console.log('Imagen subida:', result)

    // Puedes usar `result.secure_url` como la URL de la imagen
    const imagenUrl = result.secure_url // <------ guardar link de la propiedad en la base de datos

    const {
      titulo,
      descripcion,
      categoria,
      precio,
      metros,
      ambientes,
      dormitorios,
      banos,
      cochera,
      calle,
      lat,
      lng
    } = req.body

    const imagen = await ImagenesPropiedad.create({
      url: imagenUrl
    })

    let tienePrecio = await Precio.findOne({ where: { precio } })

    if (!tienePrecio) {
      // creo el precio si no existe
      tienePrecio = await Precio.create({
        precio,
        moneda: 'ARS'

      })
    }

    console.log(tienePrecio.id)

    // Crear la propiedad en la base de datos
    const nuevaPropiedad = {
      usuarioId: id,
      titulo,
      descripcion,
      categoriaId: categoria,
      precioId: tienePrecio.id,
      metros,
      ambientes,
      dormitorios,
      banos,
      cochera,
      calle,
      lat,
      lng,
      fotoId: imagen.id
    }

    const propiedadCreada = await Propiedad.create(nuevaPropiedad)

    res.status(201).json({
      success: true,
      mensaje: 'Propiedad creada correctamente',
      imagen,
      propiedad: propiedadCreada
    })

    // const validacionResultado = propiedadSchema.safeParse(req.body)
    // if (!validacionResultado.success) {
    //   return res.status(400).json({
    //     success: false,
    //     errors: validacionResultado.error.errors.map((err) => ({
    //       campo: err.path[0],
    //       mensaje: err.message
    //     }))
    //   })
    // }

    // const datosValidados = validacionResultado.data
    // console.log('Datos recibidos', datosValidados)
    // const { titulo, descripcion, categoria, precio, metros, ambientes, dormitorios, banos, cochera, calle, lat, lng } = datosValidados

    // // Busco registro de precio identico o inserto uno nuevo en la tabla
    // let tienePrecio = await Precio.findOne({ where: { precio } })
    // if (!tienePrecio) {
    //   // creo el precio si no existe
    //   tienePrecio = await Precio.create({
    //     precio,
    //     moneda: 'ARS'

    //   })
    // }

    // const imagenes = []
    // if (req.files && req.files.length > 0) {
    //   for (const file of req.files) {
    //     const result = await new Promise((resolve, reject) => {
    //       cloudinary.uploader.upload_stream(
    //         { folder: 'propiedades' },
    //         (error, result) => {
    //           if (error) reject(error)
    //           resolve(result)
    //         }
    //       ).end(file.buffer)
    //     })

    //     // Crear registro en la tabla ImagenesPropiedad
    //     const nuevaImagen = await ImagenesPropiedad.create({
    //       url: result.secure_url
    //     })

    //     imagenes.push(nuevaImagen)
    //   }
    // }

    // const {
    //   titulo,
    //   descripcion,
    //   categoria,
    //   precio,
    //   metros,
    //   ambientes,
    //   dormitorios,
    //   banos,
    //   cochera,
    //   calle,
    //   lat,
    //   lng
    // } = req.body
    // // Procesar la imagen si está presente

    // // Crear la propiedad en la base de datos
    // const nuevaPropiedad = {
    //   usuarioId: id,
    //   titulo,
    //   descripcion,
    //   categoria,
    //   precio,
    //   metros,
    //   ambientes,
    //   dormitorios,
    //   banos,
    //   cochera,
    //   calle,
    //   lat,
    //   lng,
    // }
    // const propiedadCreada = await Propiedad.create(nuevaPropiedad)

    // return res.status(201).json({
    //   success: true,
    //   message: 'Propiedad creada exitosamente',
    //   propiedad: propiedadCreada
    // })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Error al crear la propiedad' })
  }
}

export const editarPropiedad = async (req, res) => {
  try {
    const { id } = req.params
    const propiedad = await Propiedad.findByPk(id, {
      include: [
        { model: Precio, as: 'precio' },
        { model: ImagenesPropiedad, as: 'foto' },
        { model: Categoria, as: 'categoria' }
      ]
    })
    res.status(200).json({ propiedad })
  } catch (error) {
    console.error('Error al obtener las propiedades:', error)
    res.status(500).json({ message: 'Hubo un error al obtener las propiedades' })
  }
}

export const actualizarPropiedad = async (req, res) => {
  const { id } = req.params
  const { file } = req

  // Desestructurar los datos enviados en el cuerpo de la solicitud
  const {
    titulo,
    descripcion,
    categoria,
    precio,
    metros,
    ambientes,
    dormitorios,
    banos,
    cochera,
    calle,
    lat,
    lng
  } = req.body

  try {
    // Buscar la propiedad en la base de datos
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
      return res.status(404).json({ message: 'No se encontró una propiedad con ese ID' })
    }

    // Obtener la URL de la imagen actual asociada a la propiedad
    let imagenActual = await ImagenesPropiedad.findByPk(propiedad.fotoId)

    // Manejo de la actualización de la imagen (si se subió una nueva)
    if (file) {
      // Subir la nueva imagen a Cloudinary
      const nuevaImagen = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'propiedades' }, // Carpeta en Cloudinary
          (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(result)
            }
          }
        )
        uploadStream.end(file.buffer)
      })

      console.log('Nueva imagen subida:', nuevaImagen)

      // Si existe una imagen anterior, eliminarla de Cloudinary
      if (imagenActual && imagenActual.url.includes('cloudinary')) {
        const publicId = imagenActual.url.split('/').pop().split('.')[0] // Extraer el public_id
        await cloudinary.uploader.destroy(publicId)
        console.log('Imagen anterior eliminada:', publicId)
      }

      // Actualizar la URL de la nueva imagen en la base de datos
      if (imagenActual) {
        imagenActual.url = nuevaImagen.secure_url
        await imagenActual.save()
      } else {
        // Crear un nuevo registro de imagen si no existe uno previo
        imagenActual = await ImagenesPropiedad.create({
          url: nuevaImagen.secure_url
        })
      }
    }

    // Actualizar los datos de la propiedad
    await propiedad.update({
      titulo,
      descripcion,
      categoria,
      precio,
      metros,
      ambientes,
      dormitorios,
      banos,
      cochera,
      calle,
      lat,
      lng,
      fotoId: imagenActual?.id || propiedad.fotoId // Asociar el ID de la nueva imagen si corresponde
    })

    res.status(200).json({ message: 'Propiedad actualizada con éxito', propiedad })
  } catch (error) {
    console.error('Error al actualizar la propiedad:', error)
    res.status(500).json({ message: 'Error al actualizar la propiedad', error })
  }
}

export const eliminarPropiedad = async (req, res) => {
  const { id } = req.params

  try {
    // Buscar la propiedad
    const propiedad = await Propiedad.findByPk(id)
    if (!propiedad) {
      return res.status(404).json({ message: 'No se encontró una propiedad con ese ID' })
    }

    // Obtener la imagen asociada, si existe
    const imagen = await ImagenesPropiedad.findByPk(propiedad.fotoId)

    if (imagen && imagen.url.includes('cloudinary')) {
      // Eliminar la imagen de Cloudinary
      const publicId = imagen.url.split('/').pop().split('.')[0]
      await cloudinary.uploader.destroy(publicId)
      console.log('Imagen eliminada:', publicId)

      // Eliminar el registro de la imagen en la base de datos
      await imagen.destroy()
    }

    // Eliminar la propiedad de la base de datos
    await propiedad.destroy()

    res.status(200).json({ message: 'Propiedad eliminada con éxito' })
  } catch (error) {
    console.error('Error al eliminar la propiedad:', error)
    res.status(500).json({ message: 'Error al eliminar la propiedad', error })
  }
}
