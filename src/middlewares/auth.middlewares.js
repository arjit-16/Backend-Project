import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler( async(req,res,next) => {
    // const token = req.cookies.accessToken || req.header.authorization
    // const accesstoken = token.split(" ")
    // const tokenFinal = accesstoken[1];
   try {
     const token = req.cookies.accessToken || req.header("Authorization").replace("Bearer ", "");
 
     if (!token) {
         res.status(401).json({
             message: "Unauthorized Request"
         })
     }
     
     const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
 
     const user = await User.findById(decodeToken._id).select("-password -refreshToken");
 
     if (!user) {
         res.status(401).json({
             message: "Invalid Access Token"
         })
     }

     req.user = user;
     next();

   } catch (error) {
        res.status(401).json({
            message: "Invalid Token"
        })
   }

})