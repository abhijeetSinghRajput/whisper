import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})

const test = async()=>{
    try{
        const response = await cloudinary.uploader.upload('./src/lib/profile.png');
        console.log(response.secure_url)
    } catch(error){
        console.log("error while testing upload image: ", error);
    }
}

export default cloudinary;