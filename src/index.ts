import express from "express"
import 'dotenv/config';
import { dbConnect } from "./db";
import authRouter from "@/route/auth";
import productRouter from "@/route/product";
import cors from "cors";


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Server running fine!")
})

const allowedOrigins = [
  'http://localhost:3000', 
  "http://localhost:3001", 
]

app.use(cors({
  origin: (origin, callback) => { 
    // Allow requests with no origin (like mobile apps or curl requests)  
    if (!origin) return callback(null, true);
        
    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) { 
      return callback(null, true);  
    } 

    return callback(new Error('Not allowed by CORS'));
  }
}));


app.use("/auth", authRouter)
app.use("/product", productRouter)

dbConnect()
app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${process.env.PORT || 4000}!`)
})