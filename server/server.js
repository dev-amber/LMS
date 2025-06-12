import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";


//intialize the express
const app=express();

//connect to database
await connectDB()

//Middleware
app.use(cors()) // cors: help to connect our backend in any domain

//Route
app.get("/",(req,res)=>{
    res.send("Api working");
})
app.post('/clerk', express.json(), clerkWebhooks)



//PORT
const PORT=process.env.PORT || 5000


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})









