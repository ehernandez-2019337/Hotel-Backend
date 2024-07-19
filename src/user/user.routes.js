import express from 'express'
import { 
    validateJwt,
    isAdmin,
    isOneSelf
} from '../middlewares/validate-jwt.js';
import {
    test,
    registerAdmin, 
    registerClient,
    login, 
    update, 
    deleteU,
    updatePassword,
    details,
    searchUser
} from './user.controller.js';

const api = express.Router();

//RUTAS PÚBLICAS

api.post('/registerClient', registerClient)
api.post('/login', login)
api.get('/details', [validateJwt], details)
api.post('/search', [validateJwt], searchUser)

//RUTAS PRIVADAS (solo usuarios logeados)
                  //Middleware
api.post('/registerAdmin', [validateJwt, isAdmin], registerAdmin)
api.get('/test', [validateJwt, isAdmin], test)
api.put('/update/:id', [validateJwt, isOneSelf], update) //Middleware -> funciones intermedias que sirven para validar.
api.delete('/delete/:id', [validateJwt, isOneSelf], deleteU)
api.put('/updatePassword', [validateJwt], updatePassword)

export default api