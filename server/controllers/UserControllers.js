import cloudinary from "../lib/cloudinary.js";  // Cloudinary library for image uploads
import { generateToken } from "../lib/utils.js"; // Utility function to generate JWT tokens
import User from "../models/user.js";   // Mongoose model for user data

import bcrypt, { genSalt } from "bcryptjs";// Library for password hashing and comparison




/**
 * @fileoverview This file contains controller functions for user authentication
 * (signup, login, checkAuth) and profile management (updateProfile).
 * It handles user creation, password hashing, token generation, and profile updates
 * including profile picture uploads to Cloudinary.
 */

/**
 * @route POST /api/auth/signup
 * @description Registers a new user. Hashes the password and generates a JWT token upon successful creation.
 * @access Public
 * @param {Object} req - The request object, containing `req.body` with `fullName`, `email`, `password`, and `bio`.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with success status, user data, JWT token, and a message.
 */












export const  signup = async (req,res)=>{
    const{fullName,email,password,bio} = req.body;

    try {
        if(!fullName || !email || !password || !bio){
            return res.json({success: false ,message: "Missing Details"})
        }
        const user = await User.findOne({email});

        if(user){
            return res.json({success: false , message:"Account already exist"});
        }

        const salt  = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = await User.create({
            fullName,email,password:hashedPassword,bio
        });

        const token = generateToken(newUser._id)
        res.json({success:true, userData: newUser, token,message:"Account created Succesfully"})
        
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: error.message})
        
    }
}

/**
 * @route POST /api/auth/login
 * @description Logs in an existing user. Compares provided password with hashed password and generates a JWT token.
 * @access Public
 * @param {Object} req - The request object, containing `req.body` with `email` and `password`.
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with success status, user data, JWT token, and a message.
 */

export const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const userData = await User.findOne({email})

        const isPasswordCorrect =  await bcrypt.compare(password,userData.password);

        if(!isPasswordCorrect){
            return res.json({success:false ,message:"Invalid credential"});
        }

        const token = generateToken(userData._id)

        res.json({success:true,userData,token,message:"Login successfully"})

    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})

        
    }

}
/**
 * @route GET /api/auth/check
 * @description Checks if the user is authenticated. This endpoint is typically hit by the client
 * to verify the validity of their token and retrieve user data.
 * @access Private (requires authentication middleware to populate `req.user`)
 * @param {Object} req - The request object, containing `req.user` (populated by authentication middleware).
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with success status and the authenticated user's data.
 */

export const checkAuth = (req,res)=>{
    res.json({success:true, user: req.user});
}


/**
 * @route PUT /api/auth/updateProfile
 * @description Updates the profile details of the authenticated user, including profile picture, bio, and full name.
 * @access Private (requires authentication)
 * @param {Object} req - The request object, containing `req.body` with `profilePic` (base64 string), `bio`, and `fullName`,
 * and `req.user._id` (ID of the authenticated user).
 * @param {Object} res - The response object.
 * @returns {Object} JSON response with success status and the updated user data.
 */

export const updateProfile = async(req,res)=>{
    try {
        const {profilePic,bio,fullName} = req.body;

        const userId = req.user._id;
        let updatedUser;

        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId,{bio,fullName},{new:true});
        }
        else{
            const upload = await cloudinary.uploader.upload(profilePic);


            updatedUser = await User.findByIdAndUpdate(userId,{profilePic:upload.
                secure_url,bio,fullName},{new:true});
        }
        res.json({success:true,user:updatedUser})




    } catch (error) {
        console.log(error.message);
        res.json({success:true,message:error.message})
        
    }
}