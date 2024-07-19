'use stricts'

import express from 'express'
import { 
    save, 
    update, 
    deleteC, 
    test, 
    search, 
    get 
} from './category.controller.js'

import { validateJwt, isAdmin } from '../middlewares/validate-jwt.js'

const api = express.Router()

//Rutas Client:
api.get('/test', [validateJwt], test)
api.post('/search',[validateJwt], search)
api.get('/get',[validateJwt], get)

//Rutas Admin:
api.post('/save', [validateJwt, isAdmin], save)
api.put('/update/:id', [validateJwt, isAdmin], update)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteC)
export default api