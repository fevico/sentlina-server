import AuthModel from "@/model/auth";
import { RequestHandler } from "express";
import *   as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const createUser:RequestHandler = async(req, res) =>{
    try {
        const {email, password, name, address} = req.body
        const user = await AuthModel.findOne({email})
        if(user) return res.status(400).json({message: "User already exist with this credentials!"})
            const hashPassword = await bcrypt.hash(password, 10)
        const create = await AuthModel.create({email, password: hashPassword, name, address})
        return res.status(200).json({message: "user created successfully!"})
    } catch (error) {
        
    }
}

export const login: RequestHandler = async(req, res)=> {
    const {email, password} = req.body
    try {
           const user = await AuthModel.findOne({email})
    if(!user) return res.status(400).json({message: "Invalid credentials!"})
        const matchedPassword = await bcrypt.compare(password, user.password)
    if(!matchedPassword) return res.status(400).json({message: "Invalid credentials"})
        // generate jwt token 
        const payload = {id: user._id, name: user.name}
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
    const data = {name: user.name, email: user.email, token}
    return res.status(200).json({message: data})
 
    } catch (error) {
        
    }
}