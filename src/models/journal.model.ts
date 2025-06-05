import { model, Schema } from "mongoose";

const JournalSchema = new Schema({
    userId:{
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    plan:{
        type: [{
            day:Number,
            activities:[{
                site: String,
                description: String,
                time: String
            }],
        }],
        required: true
    },
    imageUrl: {
        type: String,
        trim: true,
        default: null
    }
})

const Journal = model('Journal', JournalSchema)

export default Journal