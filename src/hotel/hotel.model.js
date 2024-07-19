import { Schema, model } from 'mongoose';

const hotelSchema = Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    ubication:{
        type: String,
        required: true
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    },
    email: {
        type: String,
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

export default model('hotel', hotelSchema)