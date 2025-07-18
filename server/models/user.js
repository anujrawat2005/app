import mongoose from "mongoose";



/**
 * @fileoverview Defines the Mongoose schema for user accounts.
 * This schema outlines the structure and data types for storing
 * user information in the MongoDB database.
 */

/**
 * Mongoose Schema for a User.
 *
 * @typedef {Object} UserSchema
 * @property {string} email - The user's email address. Must be unique and is required.
 * @property {string} fullName - The user's full name. Required.
 * @property {string} password - The user's hashed password. Required, with a minimum length of 6 characters.
 * @property {string} profilePic - The URL to the user's profile picture. Defaults to an empty string if not provided.
 * @property {string} [bio] - An optional short biography for the user.
 * @property {Date} createdAt - Automatically added by `timestamps: true`. Stores the creation timestamp.
 * @property {Date} updatedAt - Automatically added by `timestamps: true`. Stores the last update timestamp.
 */
const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true },
    fullName : {type: String , required: true},
    password : {type: String, required: true, minlength:6},
    profilePic : {type: String, default: ""},
    bio : {type: String},
} ,  {timestamps: true} );


const User  = mongoose.model("User",userSchema);

export default User;  // Export the User model for use in other parts of the application

