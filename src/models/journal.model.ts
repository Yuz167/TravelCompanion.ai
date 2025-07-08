import { ItineraryType } from "@/lib/interfaces";
import { model, models, Schema } from "mongoose";

const JournalSchema = new Schema<ItineraryType>({
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
}, {timestamps: true})

const Journal = models.Itinerary || model<ItineraryType>('Journal', JournalSchema);

export default Journal