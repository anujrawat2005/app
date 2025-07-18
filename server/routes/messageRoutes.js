import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";


/**
 * @fileoverview This file defines the API routes for message-related operations.
 * All routes are protected by the `protectRoute` middleware, meaning a valid
 * authentication token is required to access them.
 */

// Create a new Express Router instance

const messageRouter = express.Router();


/**
 * @route GET /api/messages/users
 * @description Route to get a list of users for the sidebar, excluding the logged-in user,
 * and including unseen message counts.
 * @access Private
 * @middleware protectRoute - Ensures the user is authenticated.
 * @controller getUsersForSidebar - Handles the logic to fetch and filter users.
 */
messageRouter.get("/users",protectRoute , getUsersForSidebar);
messageRouter.get("/:id", protectRoute,getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id",protectRoute,sendMessage)



export default messageRouter;