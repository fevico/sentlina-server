import { model, Schema } from "mongoose";

interface Auth{
    name: string;
    email: string
    password: string
    address: string
}

const authSchema = new Schema<Auth>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String, required: false}
},{timestamps: true})

const AuthModel = model("User", authSchema)
export default AuthModel 