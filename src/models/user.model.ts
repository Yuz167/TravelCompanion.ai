import { model, Schema } from "mongoose";

const userSchema = new Schema({
    clerkId:{
        type: String,
        required: true
    }
})

const User = model('User', userSchema)

export default User