/* eslint-disable */
import mongoose from "mongoose"

let cachedConn = (global as any).mongoose
if(!cachedConn){
    cachedConn = (global as any).mongoose = { conn: null, promise: null }
}
const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING as string
export async function connectDB() {
    if(cachedConn.conn){
        return cachedConn.conn
    }
    if(!cachedConn.promise){
        mongoose.set('strictQuery', true) //controls how query filters behave when you pass fields that are not in the schema.
        cachedConn.promise = mongoose.connect(MONGODB_URI, {
            dbName: process.env.MONGODB_DATABASE_NAME
        })
    }
    try {
        cachedConn.conn = await cachedConn.promise
        return cachedConn.conn
    } catch (err) {
        // Reset the promise so future calls can retry
        cachedConn.promise = null
        throw err
    }
}