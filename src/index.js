// import connectDB from "./db/index.js";
// import dotenv from "dotenv"


// dotenv.config({
//     path: './env'
// })


// connectDB()















// (async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error",(error)=>{
//             console.log(error);
//             throw error;
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// })()






// import { connectDB } from "./db";

// connectDB();










// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
// import express from "express";

// const app = express();

// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);    //(database_url/database_name)
//         // app.on("errror",()=>{
//         //     console.log("Errr:",error);
//         //     throw error;
//         // })
//         console.log("Connected to database!!!");
//     } catch (error) {
//         console.log("Error:", error);
//     }
// })();















import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";


dotenv.config();

connectDB()               //This comes under promise which returns promise through async await function
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is listening on ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log(error,"DB connection failed");
})