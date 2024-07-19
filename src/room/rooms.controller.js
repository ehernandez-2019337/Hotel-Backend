'use strict'

import Habitaciones from './rooms.model.js'
import * as fs from 'fs'
import path from 'path'


export const save = async(req, res) => {
    try {
        let { roomName, description, price, hotel } = req.body;
        let habitacion = new Habitaciones({
            roomName,
            description,
            price,
            hotel,
            image: '/uploads/' + req.file.filename
        });
        await habitacion.save();
        res.send({ message: 'Room saved successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error saving room', err });
    }
}


export const getRooms = async(req, res)=>{
    try {
        const { id } = req.params;
        let habitacion = await Habitaciones.find({hotel: id}).populate('hotel',['name', 'phone', 'email']);
        if(!habitacion) return res.status(505).send({message: 'Error buscando esto'});
        return res.send(habitacion);
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error al mostrar habitaciones.', err});
    }
};

// Obtener una habitación por su nombre
export const searchRooms = async (req, res) => {
    try {
        const { id } = req.params
        let { search } = req.body
        const aprox = new RegExp(search, 'i')
        let rooms = await Habitaciones.find({ roomName: aprox, hotel: id }).populate('hotel', ['name', 'phone', 'email'])
        if (!rooms) return res.status(404).send({ message: 'Room not found' })
        return res.send({ message: 'Room found', rooms })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error searching Room'})
    }
  }

  
  export const update = async (req, res) => {
    try {
        // Capturar la data
        let data = req.body;
        // Capturar el id del roomo a actualizar
        let { id } = req.params;

        // Obtener la habitación actual
        let room = await Habitaciones.findById(id);

        // Verificar si se está actualizando la imagen
        if (req.file) {
            // Eliminar la imagen anterior si existe
            if (room.image) {
                const imagePath = '.' + room.image;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                } else {
                    console.log('El archivo a eliminar no existe:', imagePath);
                }
            }
            // Actualizar la imagen en los datos
            data.image = '/uploads/' + req.file.filename;
        } else {
            // Si no se proporciona una nueva imagen, mantener la imagen anterior
            data.image = room.image;
        }

        // Actualizar el roomo
        let updatedRoom = await Habitaciones.findByIdAndUpdate(id, data, { new: true });

        // Validar la actualización
        if (!updatedRoom) {
            return res.status(404).send({ message: 'Room not found and not updated' });
        }

        // Responder si todo sale bien
        return res.send({ message: 'Room updated successfully', updatedRoom });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating room' });
    }
}

export const deleteRoom = async(req, res)=>{
    try {
        let {id} = req.params

        let habitacion = await Habitaciones.findOneAndDelete({_id:id})

        if(!habitacion){
            return res.status(404).send({message: `Habitacion no encontrada y no eliminada`})
        }else{
            return res.send({message:`Habitacion eliminada`, habitacion})
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send({message:`Error al eliminar habitacion`, err})
    }
}

export const getImg = async(req, res)=>{
    const { id } = req.params
    try{
        const room = await Habitaciones.findById(id)
        if(!room) return res.status(404).send({message: 'Room not found'})
        const resolve = path.resolve(`src/${room.image}`)
        return res.sendFile(resolve)
    }catch(err){
        console.error(err)
        return res.status(500).send({message:'error getting images'})
    }
}