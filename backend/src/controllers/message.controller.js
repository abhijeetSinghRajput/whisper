import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js"
import { onlineUsers, io } from '../lib/socket.js'

export const getUsers = async(req, res)=>{
    try {
        const id = req.user._id;
        // find all the user expect mine
        const users = await User.find({_id: {$ne : id}}).select("-password");

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
        console.error("Error in geting users");
    }
} 

export const getMessages = async (req, res)=>{
    try {
        const {id: senderId} = req.params;
        const receiverId = req.user._id;
        
        const messages = await Message.find({
            $or: [
                {senderId, receiverId},
                {senderId: receiverId, receiverId: senderId}
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages controller: ", error.message);
        req.status(500).json({message: "Internal Server Error"});
    }
}

export const sendMessage = async (req, res)=>{
    try {
        const {id: receiverId} = req.params;
        const {text, image} = req.body;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })
        //todo realtime socket io
        const receiverSocketId = onlineUsers[receiverId];
        io.to(receiverSocketId).emit('newMessage', newMessage);

        res.status(201).json(newMessage); 
    } catch (error) {
        console.error("error in sendMessage controller", error.message);
        res.status(500).json({message: "Internal Server Error"}); 
    }
}