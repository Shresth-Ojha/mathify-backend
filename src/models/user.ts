import mongoose, { mongo } from "mongoose";

//schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true
        }, 
        password: {
            type: String,
            required: true
        }
    }
    ,
    {
        timestamps: true
    }
)

//model
const User = mongoose.model("User", userSchema);

export default User;