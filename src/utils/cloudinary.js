import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {      //localFilePath is the file present on local server
    try {
        if(!localFilePath){
            return null;
        }
        else{
           const response = await cloudinary.uploader.upload(localFilePath);
           //console.log("File is uploaded succesfully on cloudinary", response.url);
           fs.unlinkSync(localFilePath);
           return response;
        }
    } catch (error) {
        fs.unlinkSync(localFilePath);    //remove the temporary file from the local server
        return null;
    }
}

export {uploadOnCloudinary};