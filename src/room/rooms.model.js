import {Schema, model} from 'mongoose'

const roomSchema = Schema({
    roomName:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    state: {
        type: String, 
        uppercase: true, 
        enum: ['HOSTED', 'FREE'],
        default: 'FREE'
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'hotel',
        required: true
    },
    looked: {
        type: Number,
        required: true,
        default: 0
    },
    image:{
        type: String,
        required: true

    }
}, {
    versionKey: false
})

export default model('room', roomSchema)