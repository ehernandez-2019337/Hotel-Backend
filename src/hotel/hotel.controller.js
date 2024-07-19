'use strict'
import User from '../user/user.model.js'
import { error, log } from 'console'
import Category from '../category/category.model.js'
import{ checkUpdate } from '../utils/validator.js'
import Hotel from './hotel.model.js'
import * as fs from 'fs'
import path from 'path'

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'test function is running' })
}

//save hotel
export const save = async (req, res) => {
    try {
        const userID = req.user.id
        //Capturar la data
        let {name,category,ubication,phone,email} = req.body
        //Validar que la categoria exista
        let existingCategory = await Category.findById(category)
        if (!existingCategory) {
            return res.status(404).send({ message: 'Category not found' })
        }
        //Crear la instancia del hotel
        console.log(req.file)
        let hotel = new Hotel({
            name:name, category:category,ubication:ubication,phone:phone,email:email,user:userID,
            image:'/uploads/' + req.file.filename
        })
        

        //Guardar el hotel en db
        await hotel.save()
        //Responder si todo sale bien
        return res.send({ message: 'hotel saved successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error saving hotel' })
    }
}

// get hoteles
export const get = async (req, res) => {
    try {
        const userID = req.user.id;
        
        let userFind = await User.findOne({_id: userID})
        if (!userFind) return res.status(404).send({ message: 'error user not found' })
                
        if (userFind.role === 'MANAGER') {
            let hotels = await Hotel.find({user: userID}).populate('category', ['name'])
            return res.send(hotels)
        } else {
            let hotels = await Hotel.find().populate('category', ['name'])
            return res.send(hotels)
        }
        
    } catch (err) {
        console.error('Error getting hotels:', err);
        return res.status(500).send({ message: 'Error getting hotels' })
    }
}


// update hotel
export const update = async (req, res) => {
    try {
        // Capturar la data
        let data = req.body
        // Capturar el id del hotel a actualizar
        let { id } = req.params

        // Verificar si se está actualizando la imagen
        if (req.file) {
            // Eliminar la imagen anterior si existe
            let hotel = await Hotel.findById(id)
            if (hotel.image) {
                const imagePath = '.' + hotel.image;
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath)
                } else {
                    console.log('El archivo a eliminar no existe:', imagePath);
                }
            }
            // Actualizar la imagen en los datos
            data.image = '/uploads/' + req.file.filename
        }

        // Actualizar el hotel
        let updatedHotel = await Hotel.findByIdAndUpdate(id, data, { new: true }).populate('category', ['name'])

        // Validar la actualización
        if (!updatedHotel) {
            return res.status(404).send({ message: 'Hotel not found or not updated' })
        }

        // Responder si todo sale bien
        return res.send({ message: 'Hotel updated successfully', updatedHotel })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating hotel' })
    }
};
/*const validar = (img, sevalida) =>{
    var errors = []
    if(sevalida == 'Y' && img === undefined){
        erro.push('seleccionar una imagen en png o jpg')
    }else{
        if(errors != '' ){
            fs.unlinkSync('../uploads' + img.filename)
        }
    }
    return errors
}*/


// Función para eliminar una imagen de hotel
export const deleteHotelImage = async (image) => {
    try {
        const imagePath = path.join(__dirname, '..', './src/uploads', image)
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log('Hotel image deleted successfully')
        } else {
            console.log('Hotel image not found')
        }
    } catch (error) {
        console.error('Error deleting hotel image:', error)
    }
};



// Función para eliminar un hotel
export const deleteHotel = async (req, res) => {
    try {
        // Capturar el ID del hotel a eliminar
        const { id } = req.params;
        
        // Eliminar la imagen asociada al hotel si existe
        const hotel = await Hotel.findById(id)
        if (hotel && hotel.image) {
            await deleteHotelImage(hotel.image)
        }

        // Eliminar el hotel de la base de datos
        await Hotel.deleteOne({ _id: id })

        // Responder
        return res.send({ message: 'Hotel deleted successfully' })
    } catch (error) {
        console.error('Error deleting hotel:', error);
        return res.status(500).send({ message: 'Error deleting hotel' })
    }
}


// search
export const search = async (req, res)=>{
    try{
        //obtener el paremetro de busqueda
        let {name} = req.body
        let regex = new RegExp(name,'i')

        //buscar
        
        let hotels = await Hotel.find({name: regex}).populate('category', ['name', 'phone', 'email','ubication'])


        //validar la respuesta
        if(!hotels) return res.status(400).send({message: 'hotels not found'})

        //responder al usuario
        return res.send({message:`hotels found`, hotels})
    }catch(err){
        console.error(err)
        return res.status(500).send({message:'error searching hotels'})
    }

}

export const getImg = async(req, res)=>{
    const { id } = req.params
    try{
        const hotel = await Hotel.findById(id)
        if(!hotel) return res.status(404).send({message: 'Hotel not found'})
        const resolve = path.resolve(`src/${hotel.image}`)
        return res.sendFile(resolve)
    }catch(err){
        console.error(err)
        return res.status(500).send({message:'error getting image'})
    }
}
