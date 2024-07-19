'use strict'

import Reservation from './reservation.model.js'
import User from '../user/user.model.js'
import Service from '../services/service.model.js'
import Event from '../event/event.model.js'
import Room from '../room/rooms.model.js'
import Hotel from '../hotel/hotel.model.js'

export const test = (req, res) => {
    console.log('test is running')
    res.send({message: 'test reservation is running'})
}

export const saveReservation = async (req, res) => {
    try {
        const userID = req.user.id;
        const data = req.body;
        data.user = userID;

        const userExist = await User.findOne({ _id: userID });
        if (!userExist) return res.status(404).send({ message: 'User not found or does not exist' });

        if (data.event) {
            const event = await Event.findOne({ _id: data.event });
            if (!event) return res.status(404).send({ message: 'Event not found or does not exist' });
            if (data.startDate > data.endDate) {
                return res.status(400).send({ message: 'End date cannot be before start date' });
            }
            let eventExist = await Reservation.findOne(
                {
                    event: data.event,
                    startDate: { $lte: data.endDate },
                    endDate: { $gte: data.startDate }
                });
            if (eventExist) {
                return res.status(500).send({ message: 'Event already reserved' });
            } else {
                event.state = 'HOSTED'; 
                await event.save();
            }
        } else {
            const room = await Room.findOne({ _id: data.room });
            if (!room) return res.status(404).send({ message: 'Room not found or does not exist' });
            if (data.startDate > data.endDate) {
                return res.status(400).send({ message: 'End date cannot be before start date' });
            }
            let roomExist = await Reservation.findOne(
                {
                    room: data.room,
                    startDate: { $lte: data.endDate },
                    endDate: { $gte: data.startDate }
                });
            if (roomExist) {
                return res.status(500).send({ message: 'Room already reserved' });
            } else {
                room.state = 'HOSTED';
                await room.save();
            }
        }

        let newReservation = new Reservation(data);
        const reservationSaved = await newReservation.save();
        return res.send({ message: 'Reservation saved successfully', reservationSaved });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error saving reservation', err });
    }
};





export const addService = async (req, res) => {
    try {
        // Traer el id del usuario
        const userID = req.user.id

        // ID de la reserva
        const { id } = req.params
        // ID del servicio
        const data = req.body

        // Verificar que exista el servicio
        const service = await Service.findOne({ _id: data.service})
        if (!service) return res.status(404).send({ message: 'Service not found or does not exist' })

        // Buscar la reserva
        let reservation = await Reservation.findOne({ _id: id, user: userID})
        if(!reservation) return res.status(404).send({message: 'Error does not exist a reservation'})
        // Verificar si el servicio ya está en el arreglo arrServices
        const existingServiceIndex = reservation.arrServices.findIndex(serv => serv.service.toString() === data.service)

        if (existingServiceIndex !== -1) {
            // Si el servicio ya existe, aumentar la cantidad y el subtotal
            reservation.arrServices[existingServiceIndex].cant += 1;
            reservation.arrServices[existingServiceIndex].subtotal += service.price
        } else {
            // Si el servicio no existe, agregarlo al arreglo
            reservation.arrServices.push({
                service: service._id,
                cant: 1,
                subtotal: service.price
            })
        }

        // Guardar la reserva
        const savedReservation = await reservation.save()
        await savedReservation.populate('arrServices.service', ['type', 'price'])

        return res.send({ message: 'Service added successfully', savedReservation})
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error adding a new service', error: err })
    }
}

export const deleteReservation = async (req, res) => {
    try {
      const userID = req.user.id;
      let { id } = req.params;
  
      let reservationExist = await Reservation.findOne({ _id: id, user: userID });
      if (!reservationExist) return res.status(404).send({ message: 'Reservation not exists or you do not have permissions' });
  
      if (reservationExist.room) {
        await Room.findByIdAndUpdate(reservationExist.room, { state: 'FREE' });
      }
  
      await Reservation.findByIdAndDelete(id);
  
      return res.send({ message: 'Reservation deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error deleting reservation' });
    }
  };
  

 
export const getReservations = async (req, res) => {
    try {
        // Traer el ID del usuario
        const userID = req.user.id;

        // Traer las reservaciones hechas por el usuario
        let reservations = await Reservation.find({ user: userID })
            .populate('user', ['name', 'surname'])
            .populate({
                path: 'room',
                populate: {
                    path: 'hotel',
                    select: 'name' // Solo selecciona el nombre del hotel
                }
            })
            .populate('event', ['type', 'price'])
            .populate('arrServices.service', ['type', 'price']);
            
        if (!reservations) return res.status(404).send({ message: 'No tienes reservaciones aún' });

        // Responder 
        return res.send({ message: 'Reservaciones encontradas:', reservations });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al obtener reservaciones' });
    }
};


export const getReservationRoom = async(req, res) => {
    try{
        // Buscar las reservaiones 
        let reservations = await Reservation.find()
        // Obtener los IDs de los cuartos reservados
        const roomIds = reservations.filter(reservation => reservation.room).map(reservation => reservation.room)

        // Buscar cuarto por cuarto
        const reservedRooms = await Room.find({ _id: { $in: roomIds } })

        // Responder al usuario con los cuartos reservados
        return res.send({message: 'Rooms reserveds', reservedRooms })
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting room reserveds'})
    }
}

export const getReservedUser = async(req, res) => {
    try{
        // Buscar las reservaciones 
        let users = await Reservation.find()
        // Obtener los IDs de los cuartos reservados
        const usersId = users.filter(reservation => reservation.user).map(reservation => reservation.user)

        // Buscar cuarto por cuarto
        const reservedUsedr = await User.find({ _id: { $in: usersId } })

        // Responder al usuario con los cuartos reservados
        return res.send({message: 'Users reserveds', reservedUsedr })
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting users reserveds'})
    }
}

