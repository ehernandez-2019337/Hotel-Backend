import { Schema, model } from 'mongoose'

const reservationSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'room',
        required: false
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'event',
        required: false
    },
    arrServices: [{
        service: {
            type: Schema.Types.ObjectId,
            ref: 'service',
            required: false
        },
        cant: {
            type: Number, 
            requerid: false, 
        },
        subtotal: {
            type: Number, 
            requerid: false, 
            default: 0
        } 
    }]
},{
    versionKey: false
})

export default model('reservation', reservationSchema)