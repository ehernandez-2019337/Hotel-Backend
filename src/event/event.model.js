import {Schema, model} from "mongoose"

const eventSchema = Schema({
    type: {
        type: String,
        required: true
    },
    price: {
        type: String,
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
    image:{
        type: String,
        required: true
    }
},{
    versionKey: false
})

export default model('event', eventSchema)