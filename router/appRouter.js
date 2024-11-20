import { Router } from 'express'
import { getHomeData, searchCategories, getPropiedad, getCategorias, getUsuario, getById, buscar, buscarPorCategoria } from '../controllers/appController.js'
const appRoute = Router()

appRoute.get('/', getHomeData)
appRoute.get('/categorias', getCategorias)
appRoute.get('/usuarios/:id', getUsuario)
// appRoute.get('/categorias/buscar', searchCategories)
appRoute.get('/categorias/buscar/:id', getById)
appRoute.get('/buscar', buscar)
appRoute.get('/buscar/categoria', buscarPorCategoria)

appRoute.get('/propiedades/:id', getPropiedad)

export default appRoute
