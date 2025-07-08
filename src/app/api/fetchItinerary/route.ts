import { fetchItinerary } from "@/lib/helper"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const {searchParams} = new URL(req.url)
        const userId = searchParams.get('userId')
        const itinerary = await fetchItinerary({useId: userId!})
        return NextResponse.json(itinerary, { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response('Error fetching itinerary', { status: 400 })
    }
}