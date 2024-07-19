
'use strict'

import Service from './service.model.js'

export const createService = async(req, res) =>{
    try {
        let data = req.body
        let service = new Service(data)
        await service.save();
        res.send({message: 'Service saved succesfully'})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error saving service'})
    }
}

export const readService = async(req, res)=>{
    try {
        const { id } = req.params 
        let services = await Service.find({hotel: id}).populate('hotel', 'name')
        return res.send(services)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error getting services'})
    }
}

export const searchService = async (req, res)=>{
    try{
        const {id} = req.params
        let {type} = req.body
        let regex = new RegExp(type,'i')

        let services = await Service.find(    
            {type: regex, hotel: id}
        ).populate('hotel', 'name')

        if (!services || services.length === 0) {
            return res.status(404).send({ message: 'No events found' });
        }

        return res.send({message: 'services found', services })
    }catch(err){
        console.error(err)
        return res.status(500).send({message:'error searching services'})
    }
}

export const updateService = async(req, res)=>{
    try {
        let data = req.body
        let {id} = req.params

        let service = await Service.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )

        if(!service){
            return res.status(404).send({message:'Servicio not found and not updated'})
        }else{
            return res.send({message: 'Updated service', service})
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating service'})
    }
}

export const deleteService = async(req, res)=>{
    try {
        let {id} = req.params

        let service = await Service.findOneAndDelete({_id: id})
        if(!service){
            return res.status(404).send({message: 'Service not found and not deleted'})
        }else{
            return res.send({message: 'Deleted service', service})
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting service'})
    }
}
