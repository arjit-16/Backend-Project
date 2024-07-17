// import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js";



// const connectDB = async ()=>{
//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.Connection.host}`);
//     } catch (error) {
//         console.log(error);
//         process.exit(1);
//     }
// }

// export default connectDB;













// import mongoose from "mongoose";

// const connectDB = async ()=>{
//     try {
//         await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
//         console.log("Database connected!!");
//     } catch (error) {
//         console.log("database connection error:",error);
//     }
    
// }

// export {connectDB} 








import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MongoDB Connected!!!");
        // console.log(connectionInstance.connection.host);
    } catch (error) {
        console.log("ERROR",error)
    }
}

export default connectDB;                     // connect db is async function which returns a promise