/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI } from "@google/genai"
import Journal from "@/models/journal.model"
import { connectDB } from "@/lib/mongoose"


const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const validatePlan = (plan:any) => {
    const validatedPlan = {
        title: plan.title,
        plan: plan.plan.map((day:any) => {
            return {
                day: typeof day.day === "string" ? parseInt(day.day) : day.day,
                activities: day.activities.map((activity:any) => {
                    return {
                        site: activity.site,
                        description: activity.description,
                        time: activity.time
                    }
                })
            }
        })
    }

    return validatedPlan
}

export async function POST(req: Request) {
    try {
        const {preferredSites, location, daysStaying, type, firstTime, userId} = await req.json()

        const prompt = `You are an experienced tour guide creating a personalized travel plan based on:
        Location: ${location}
        DaysStaying: ${daysStaying}
        Type: ${type}
        FirstTime: ${firstTime? "true":"false"}
        PreferredSites: ${preferredSites}
        
        As a professional tour guide:
        - Create a personalized itinerary based on the user's informations above.
        - Create a tight schedule(for travellers who want to visit as many sites as possible) or a relaxed/flexible schedule(for travellers who want to focuse on the iconic sites and don't want to be too tired) based on the user's "Type" field above.
        - Account for the user's "FirtTime" field above. If the user is a first time traveller, schedule them iconic and famous sites. If not, schedule them sites they may have not been to in the past(less famous but still worth visiting sites).
        - "PreferredSites" shows the kinds of attractions or experiences the user is most interested in (nature, food, history, museums, shopping, etc). This should be used to help you plan the itinerary, but it does not need to be the entire itinerary.

        CRITICAL SCHEMA INSTRUCTIONS:
        - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
        - "day" MUST ALWAYS be NUMBERS, never strings
        - "time" MUST ALWAYS be strings, like "10:00 AM", "2:00 PM", etc.
        - "description" should only and briefly describe the site.
        - NEVER include strings for numerical fields
        - NEVER add extra fields not shown in the example below
        
        Return a JSON object with this EXACT structure:
        {
            "title": "Plan Title",
            "plan": [
            {
                "day": 1,
                "activities": [
                {
                    "site": "Site Name",
                    "description": "Site Description",
                    "time": "10:00 AM",
                }
                ]
            }
            ]
        }
        
        DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;

        const response = await genAI.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                temperature: 0.4,
                topP: 0.9,
                responseMimeType: "application/json",
            },
        });

        const planText = response.text

        let plan = JSON.parse(planText!);
        plan = validatePlan(plan);

        await connectDB()
        const journal = new Journal({
            userId,
            title: plan.title,
            location,
            plan: plan.plan,
        })
        await journal.save()
        return new Response('Plan successfully generated', { status: 200 })
    } catch (error:any) {   
        console.log(error)
        return new Response(JSON.stringify({error:error.message, }), { status: 500, 
            headers: { 'Content-Type': 'application/json' } })
    }

}