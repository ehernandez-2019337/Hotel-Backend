'use stricts'

import express from 'express'
import{
    save,
    update,
    deleteRoom,
    getRooms,
    searchRooms,
    getImg  
} from './rooms.controller.js'
import { 
    isAdmin, 
    validateJwt 
} from '../middlewares/validate-jwt.js';

import { uploadImage } from '../middlewares/storage.js'


const api = express.Router();

// Rutas Client
api.get('/get/:id', [validateJwt], getRooms)
api.post('/searchRoom/:id', [validateJwt], searchRooms)

// Rutas Admin 
api.post('/save', [validateJwt, isAdmin],uploadImage.single('image'), save)
api.put('/update/:id', [validateJwt, isAdmin], uploadImage.single('image'),update)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteRoom)
api.get('/getImg/:id', getImg)




export default api