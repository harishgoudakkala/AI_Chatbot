import { Request, Response, NextFunction } from "express";
import User from "../Models/User.js";
import { configureOpenAI } from "../config/openai-config.js";

export const generateChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message } = req.body;
        const user = await User.findById(res.locals.jwtData.id);

        if (!user) {
            return res.status(401).json({ message: "User not registered" });
        }

        // Structure the chats in the expected format
        const chats = {
            contents: user.chats.map(({ role, content }) => ({
                role: role === "assistant" ? "model" : "user",
                parts: [{ text: content }]
            }))
        };

        // Push the new user message
        chats.contents.push({
            role: "user",
            parts: [{ text: message }]
        });

        // Update user's chat history
        user.chats.push({ content: message, role: "user" });

        const model = configureOpenAI();
        
        // Send structured conversation history
        const result = await model.generateContent(chats);

        // Extract the assistant's response
        const chatResponse = await result.response;
        const assistantMessage = chatResponse.text();

        // Save the assistant's response
        user.chats.push({ content: assistantMessage, role: "assistant" });
        await user.save();
        return res.status(200).json({
            message: "Chat generated successfully",
            chatResponse: assistantMessage
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error });
    }
};


export const getAllChats =  async (req: Request, res:Response, next:NextFunction) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if(!user) return res.status(401).json({message: "User not found"});
        if(user._id.toString() !== res.locals.jwtData.id) return res.status(401).json({message: "Permission denied"});
        return res.status(200).json({message: "OK", chats: user.chats})
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: "User verification failed"});
    }
}
export const deleteChats =  async (req: Request, res:Response, next:NextFunction) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if(!user) return res.status(401).json({message: "User not found"});
        if(user._id.toString() !== res.locals.jwtData.id) return res.status(401).json({message: "Permission denied"});
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({message: "OK"})
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: "User verification failed"});
    }
}