'use strict'

// Importaciones de servicios o ¿librerías?
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import { config } from "dotenv"
import categoryRoutes from '../src/category/category.routes.js'
import userRoutes from '../src/user/user.routes.js'
import eventRoutes from '../src/event/event.routes.js'
import reservationRoutes from '../src/reservation/reservation.routes.js'
import roomRoutes from '../src/room/rooms.routes.js'
import invoiceRoutes from '../src/invoice/invoice.routes.js'
import serviceRoutes from '../src/services/service.routes.js'
import hotelRoutes from '../src/hotel/hotel.routes.js'

// Configuraciones 
const app = express()
config()
const port = process.env.PORT || 3056

//Configuraciones del servidor 
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

// Declaraciones de Rutas
app.use('/user', userRoutes)
app.use('/category', categoryRoutes)
app.use('/hotel', hotelRoutes)
app.use('/event', eventRoutes)
app.use('/reservation', reservationRoutes)
app.use('/room', roomRoutes)
app.use('/invoice', invoiceRoutes)
app.use('/service', serviceRoutes)

// Levantar el servidor 
export const initServer = () => {
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}