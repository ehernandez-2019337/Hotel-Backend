'use stricts'

import express from 'express'
import {  
    test,
    save,
    get,
    update,
    deleteHotel,
    search,
    getImg
 } from './hotel.controller.js'
import { 
    isAdmin, 
    validateJwt 
} from '../middlewares/validate-jwt.js'

import { uploadImage } from '../middlewares/storage.js'

const api = express.Router();

// Rutas públicas
api.get('/test', [validateJwt], test)
api.get('/get', [validateJwt], get)
api.post('/search', [validateJwt], search)

// Rutas privadas 
api.post('/save', [validateJwt, isAdmin], uploadImage.single('image'),save)
api.put('/update/:id',[validateJwt, isAdmin], uploadImage.single('image'), update)
api.delete('/delete/:id',[validateJwt, isAdmin],  deleteHotel)
api.get('/getImg/:id', getImg)


export default api