'use strict'
import express from 'express'

import {
    test,
    getAllEvents,
    searchEvents,
    create,
    deleteEvent,
    // getEventsByHotel,
    update,
    getImg
}from './event.controller.js'

import { 
    isAdmin, 
    validateJwt 
} from '../middlewares/validate-jwt.js';

import { uploadImage } from '../middlewares/storage.js'


const api = express.Router();

//Rutas Client 
api.get('/getAllEvents/:id', [validateJwt], getAllEvents)
api.post('/searchEvent/:id',   searchEvents)
// api.get('/getEventsByHotel/:id',[validateJwt], getEventsByHotel)
api.get( '/test',test); //prueba de conexion al servidor

// Rutas Admin
api.post('/create', [validateJwt, isAdmin], uploadImage.single('image'), create)
api.put('/update/:id', [validateJwt, isAdmin],uploadImage.single('image'), update)
api.delete('/deleteEvent/:id', [validateJwt, isAdmin], deleteEvent)
api.get('/getImg/:id', getImg)





export default api