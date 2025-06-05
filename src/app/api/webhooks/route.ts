import { createUser, deleteUser } from '@/actions/user.actions'
import { connectDB } from '@/lib/mongoose'
import { verifyWebhook } from '@clerk/nextjs/webhooks'

export async function POST(req: Request) {
  try {
    // @ts-expect-error: third-party library has incorrect type definition
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const eventType = evt.type

    if (eventType === 'user.created') {
        try {
            await connectDB()
            const {id} = evt.data
            const response = await createUser({clerkId: id})  
            return new Response(JSON.stringify(response.user), { status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        } catch (error) {
            console.log(error)
            return new Response('Error creating user', { status: 400 })
        }
    }

    if(eventType === 'user.deleted') {
        try {
            await connectDB()
            const {id} = evt.data
            const response = await deleteUser(id!)  
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        } catch (error) {
            console.log(error)
            return new Response('Error deleting user', { status: 400 })
        }
    }
    
    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}