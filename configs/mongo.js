'use strict'

import mongoose from 'mongoose'

export const connect = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('MongoDB | Could not be connect to mongoDB')
            mongoose.disconnect()
        })
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | try connecting')
        })
        mongoose.connection.on('connected', () => {
            console.log('MongoDB | connected to mongodb')
        })
        mongoose.connection.once('open', () => {
            console.log('MongoDB | connected to database')
        })
        mongoose.connection.on('reconected', () => {
            console.log('MongoDB | reconected to mongodb')
        })
        mongoose.connection.on('disconected', () => {
            console.log('MongoDB | disconeted')
        })
        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50
        })
        console.log('Connected to DB')
    } catch (err) {
        console.log(err)
    }
}