/* eslint-disable @typescript-eslint/no-explicit-any */
import Journal from "@/models/journal.model"
import { connectDB } from "./mongoose"



export async function fetchItinerary({useId}:{useId:string|undefined}){
    try {
        await connectDB()
        const itinerary = await Journal.find({userId: useId}).sort({createdAt: -1})
        return {success: true, itinerary}
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error fetching itinerary: ${error.message || 'Unknown error'}`)
    }
}
