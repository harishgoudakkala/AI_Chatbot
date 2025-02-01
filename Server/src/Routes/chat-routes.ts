import { Router } from "express";
import { verifyToken } from "../Utils/token-manager.js";
import { chatValidator, validate } from "../Utils/validatiors.js";
import { generateChat } from "../Controllers/chat-controller.js";

const  chatRoutes = Router();

chatRoutes.post("/new", validate(chatValidator),verifyToken, generateChat)

export default chatRoutes;