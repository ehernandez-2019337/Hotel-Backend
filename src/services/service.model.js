import { Schema, model } from 'mongoose';

const serviceSchema = Schema({
    type:{
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
    }
},{
    versionKey: false
})

export default model('service', serviceSchema)