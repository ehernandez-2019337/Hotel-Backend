import { Router } from 'express'
import { 
    addService,
    deleteReservation, 
    getReservationRoom, 
    getReservations, 
    getReservedUser, 
    saveReservation, 
    test 
} from './reservation.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'


const api = Router()

api.post('/test', test)
api.post('/saveReservation', [validateJwt], saveReservation)
api.delete('/deleteReservation/:id',[validateJwt], deleteReservation)
api.post('/addService/:id', [validateJwt, addService])
api.get('/getReservations', [validateJwt], getReservations)
api.get('/getRoomsReserved', [validateJwt], getReservationRoom)
api.get('/getUsersReserved', [validateJwt], getReservedUser)

export default api