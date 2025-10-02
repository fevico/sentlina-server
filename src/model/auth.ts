import { model, Schema } from "mongoose";

interface Auth{
    name: string;
    email: string
    password: string
    address: string
    role: "user" | "admin"
}

const authSchema = new Schema<Auth>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String, required: false},
    role: {type: String, enum: ["user", "admin"], default: "user"}
},{timestamps: true})

const AuthModel = model("User", authSchema)
export default AuthModel 