'use strict'

import Event from './event.model.js' 
import Hotel from '../hotel/hotel.model.js'
import{ checkUpdate } from '../utils/validator.js'
import * as fs from 'fs'
import path from 'path'



export const test = (req, res) => {
  console.log('test') 
  return res.send({ message: 'Test is running' }) 
}

// Obtener todos los eventos
export const getAllEvents = async (req, res) => {
  try {
    const { id } = req.params
    let events = await Event.find({hotel: id}).populate('hotel', ['name', 'phone', 'email'])
    return res.send(events) 
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'They can not be seen the Events' }) 
  }
}

// Obtener un evento por su Nombre
export const searchEvents = async (req, res) => {
  try {
    const {id} = req.params
      const { type } = req.body;
      if (!type) {
          return res.status(400).send({ message: 'Type is required' });
      }
      const regex = new RegExp(type, 'i');

      const events = await Event.find({ type: regex, hotel: id }).populate('hotel', ['name']);
      if (!events || events.length === 0) {
          return res.status(404).send({ message: 'No events found' });
      }
      return res.send({ message: 'Events found', events });
  } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error searching events' });
  }
};

// Crear un nuevo evento
export const create = async (req, res) => {
  try {
      //Capturar la data
      let {type,price,hotel} = req.body
      //Validar que la categoria exista
      let existingHotel = await Hotel.findById(hotel);
      if (!existingHotel) {
          return res.status(404).send({ message: 'Hotel not found' })
      }
      //Crear la instancia del hotel
      console.log(req.file)
      let event = new Event({
        type: type,
        price:price,
        hotel:hotel,
        image:'/uploads/' + req.file.filename
      })
      //Guardar el hotel en db
      await event.save()
      //Responder si todo sale bien
      return res.send({ message: 'Event saved successfully' })
  } catch (err) {
      console.error(err)
      return res.status(500).send({ message: 'Error saving event  ' })
  }
}

// Actualizar un evento
export const update = async (req, res) => {
  try {
      // Capturar la data
      let data = req.body
      // Capturar el id del evento a actualizar
      let { id } = req.params

      // Verificar si se está actualizando la imagen
      if (req.file) {
          // Eliminar la imagen anterior si existe
          let event = await Event.findById(id)
          if (event.image) {
              const imagePath = '.' + event.image
              if (fs.existsSync(imagePath)) {
                  fs.unlinkSync(imagePath)
              } else {
                  console.log('El archivo a eliminar no existe:', imagePath)
              }
          }
          // Actualizar la imagen en los datos
          data.image = '/uploads/' + req.file.filename 
      }

      // Actualizar el evento
      let updatedEvent = await Event.findByIdAndUpdate(id, data, { new: true }).populate('hotel', ['name'])

      // Validar la actualización
      if (!updatedEvent) {
          return res.status(404).send({ message: 'Event not found and not updated' })
      }

      // Responder si todo sale bien
      return res.send({ message: 'Event updated successfully', updatedEvent })
  } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error updating event' })
  }
}

// Eliminar un evento
export const deleteEvent = async (req, res) => {
  try {
    let deletedEvent = await Event.findByIdAndDelete(req.params.id) 
    if (!deletedEvent) {
      return res.status(404).send({ error: 'Event not found' }) 
    }
    res.send({message:'Event was delete succesfully', deletedEvent}) 
  } catch (error) {
    res.status(500).send({ error: 'Could not delete event' }) 
  }
}

export const getImg = async(req, res)=>{
  const { id } = req.params
  try{
      const event = await Event.findById(id)
      if(!event) return res.status(404).send({message: 'Event not found'})
      const resolve = path.resolve(`src/${event.image}`)
      return res.sendFile(resolve)
  }catch(err){
      console.error(err)
      return res.status(500).send({message:'error getting images'})
  }
}

/*
// Buscar los eventos que tiene la categoria
export const getEventsByHotel = async (req, res) => {
  try {
      let { id } = req.params 

      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).send({ message: 'Invalid event -- Not Found Event' }) 
      }

      let events = await Event.find({hotel: id}) 

      return res.send(events) 
  } catch (error) {
      console.error(error) 
      return res.status(500).send({ message: 'Error retrieving Events by event', error: error }) 
  }
} 
*/
