'use stricts'

import express from 'express'
import {  
    test,
    generateInvoice,
    invoiceRechazed,
    getInvoiceUser,
    getAllInvoices
 } from './invoice.controller.js'

 import {  
    validateJwt
 } from '../middlewares/validate-jwt.js';


const api = express.Router();

// Rutas públicas
api.get('/test', test)
api.get('/generateInvoice/:id', [validateJwt], generateInvoice)
api.put('/invoiceRechazed/:id', [validateJwt], invoiceRechazed)
api.get('/getInvoiceUser', [validateJwt], getInvoiceUser)
api.get('/getAllInvoices', [validateJwt], getAllInvoices)

export default api