import Message from "../models/Message.js"; // Mongoose model for chat messages
import User from "../models/user.js";  // Mongoose model for user data
import cloudinary from "../lib/cloudinary.js"; // Cloudinary library for image uploads
import{io , userSocketMap} from "../server.js";  // Socket.IO server instance and a map to track online users' socket IDs
 




//Get all user except logged user


/**
 * @fileoverview This file contains controller functions for handling chat-related API endpoints.
 * It manages operations such as fetching users, retrieving messages, sending messages,
 * and marking messages as seen, with integration for real-time communication via Socket.IO
 * and image storage via Cloudinary.
 */

/**
 * @route GET /api/users
 * @description Get all users except the currently logged-in user, and count unseen messages.
 * @access Private (requires authentication)
 * @param {Object} req - The request object, containing `req.user._id` (ID of the authenticated user).
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with success status, an array of filtered users,
 * and an object containing unseen message counts per user.
 */
export const getUsersForSidebar = async(req,res)=>{
    try {
        const userId = req.user._id;
        // Find all users except the current user and exclude their password from the results
        const filteredUsers = await User.find({_id:{$ne:userId}}) .select("-password");
        
        //count number of message not seen

        // Initialize an object to store unseen message counts for each user

        const unseenMessages = {}
        const promises = filteredUsers.map(async(user)=>{
            // Find messages sent by 'user' to the current 'userId' that have not been seen
            const messages = await Message.find({senderId: user._id,receiverId:userId ,seen:false})
            // If there are unseen messages from this user, record the count

            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success:true,users:filteredUsers,unseenMessages})
        
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
        
    }
}

//get all message from selected user
/**
 * @route GET /api/messages/:id
 * @description Get all messages between the logged-in user and a selected user.
 * Also marks messages sent by the selected user to the logged-in user as seen.
 * @access Private (requires authentication)
 * @param {Object} req - The request object, containing `req.params.id` (ID of the selected user)
 * and `req.user._id` (ID of the authenticated user).
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with success status and an array of messages.
 */
export const getMessages = async(req,res)=>{
    try {
        const{id:selectedUserId} =req.params; // Get the ID of the selected user from request parameters
        const myId = req.user._id; // Get the ID of the authenticated user

        const messages  = await Message.find({
            $or:[
                {senderId:myId, receiverId:selectedUserId},
                {senderId:selectedUserId , receiverId:myId},
            ]
        })
        await Message.updateMany({senderId:selectedUserId , receiverId:myId},
            {seen:true}
        );

        res.json({success:true,messages})



    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
        
    }

}

/**
 * @route PUT /api/messages/seen/:id
 * @description Mark a specific message as seen using its message ID.
 * @access Private (requires authentication)
 * @param {Object} req - The request object, containing `req.params.id` (ID of the message to mark as seen).
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with success status.
 */

export const markMessageAsSeen = async(req,res)=>{
    try {
        const { id } = req.params;

        await Message .findByIdAndUpdate(id,{seen:true})
        res.json({success:true})
    } catch (error) {
        console.log(error.message);
        res.json({success:false , message:error.message})
        
    }
}

/**
 * @route POST /api/messages/send/:id
 * @description Send a new message (text or image) to a selected user.
 * If an image is provided, it's uploaded to Cloudinary.
 * Emits the new message in real-time to the receiver via Socket.IO.
 * @access Private (requires authentication)
 * @param {Object} req - The request object, containing `req.body` (text and/or image)
 * and `req.params.id` (receiver's ID), `req.user._id` (sender's ID).
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with success status and the newly created message.
 */

export const sendMessage = async(req,res)=>{
    try {
        const {text,image} = req.body;
        const receiverId = req.params.id;
        const senderId  = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image) 
            imageUrl = uploadResponse.secure_url;

        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl

        })


        //emit new message to receiver sockets

        const receiverSocketId = userSocketMap[receiverId];

        if(receiverSocketId){
            io.to(receiverSocketId).emit("New messages", newMessage)
        }





        res.json({success:true, newMessage});


        
    } catch (error) {
        console.log(reportError.message);
        res.json({success:false, message:error.message})
    }
}