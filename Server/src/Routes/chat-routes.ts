import { Router } from "express";
import { verifyToken } from "../Utils/token-manager.js";
import { chatValidator, validate } from "../Utils/validatiors.js";
import { deleteChats, generateChat, getAllChats } from "../Controllers/chat-controller.js";

const  chatRoutes = Router();

chatRoutes.post("/new", validate(chatValidator),verifyToken, generateChat)
chatRoutes.get("/all-chats",verifyToken, getAllChats)
chatRoutes.delete("/delete",verifyToken, deleteChats)

export default chatRoutes;