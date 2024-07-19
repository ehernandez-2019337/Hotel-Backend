'use stricts'

import express from 'express'
import{
    createService,
    readService,
    updateService,
    deleteService,
    searchService
} from './service.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js';

const api = express.Router();

api.post('/createService', [validateJwt, isAdmin], createService )
api.get('/readService/:id',[validateJwt],  readService)
api.post('/searchService/:id', [validateJwt], searchService)
api.put('/updateService/:id',[validateJwt, isAdmin], updateService)
api.delete('/deleteService/:id',[validateJwt, isAdmin], deleteService)

export default api