import { Router } from 'express'
import { getHomeData, searchCategories, getPropiedad } from '../controllers/appController.js'
const appRoute = Router()

appRoute.get('/', getHomeData)
appRoute.get('/categorias/buscar', searchCategories)
appRoute.get('/propiedades/:id', getPropiedad)

export default appRoute
