import { Schema, model } from 'mongoose';

const invoiceSchema = Schema({
    date: {
        type: Date,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    nit: {
        type: String,
        required: true,
        default: 'CF'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    arrRooms: [{
        room: {
            type: Schema.Types.ObjectId,
            ref: 'room',
            required: false
        },
        nights: {
            type: Number, 
            required: false,
            default: 1 
 
        },
        subtotal: {
            type: Number, 
            required: false, 
            default: 0
        } 
    }],
    arrEvents: [{
        event: {
            type: Schema.Types.ObjectId,
                ref: 'event',
                required: false
        },
        nights: {
            type: Number, 
            required: false,
            default: 1 
 
        },
        subtotal: {
            type: Number, 
            required: false, 
            default: 0
        }
    }],
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
    }],
    total: {
        type: Number,
        required: true,
        default: 0
    },
    state: {
        type: String,
        uppercase: true, 
        enum: ['AUTHORIZED', 'RECHAZED'],
        required: true,
    }
}, {
    versionKey: false
})

export default model('invoice', invoiceSchema);