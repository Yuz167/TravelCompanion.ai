"use server"

import User from "@/models/user.model"
import { IUser } from "@/shared/shared.types"

export async function createUser(user: IUser) {
    try {
        const userCreated = await User.create(user)
        return {success: true, user:userCreated}
    } catch (error:any) {
        console.log(error)
        throw new Error(`Error creating user: ${error.message || 'Unknown error'}`)
    }
}