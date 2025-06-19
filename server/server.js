import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";




//intialize the express
const app=express();

//connect to database
await connectDB()
await connectCloudinary()


//Middleware
app.use(cors()) // cors: help to connect our backend in any domain
app.use(clerkMiddleware())

//Route
app.get("/",(req,res)=>{res.send("Api working")})
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator',express.json(), educatorRouter)
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);
// foe webhook stripe
app.post("/stripe",express.raw({type: 'application/json'}), stripeWebhooks);


//PORT
const PORT=process.env.PORT || 5000


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})









