"use server"

import User from "@/models/user.model"
import { IUser } from "@/shared/shared.types"

export async function createUser(user: IUser) {
    try {
        const userCreated = await User.create(user)
        return {success: true, user:userCreated}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error creating user: ${error.message || 'Unknown error'}`)
    }
}