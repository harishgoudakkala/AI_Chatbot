import { Request, Response,NextFunction } from "express";
import User from "../Models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { ChatCompletionRequestMessage, OpenAIApi } from "openai";

export const generateChat = async (req:Request, res:Response, next:NextFunction) => {
    try {
        
    {const {message} = req.body;
    const user = await User.findById(res.locals.jwtData._id);
    if (!user) {
        return res.status(401).json({ message: "User not registered" });
    }
    const chats = user.chats.map(({role, content})=>({role, content})) as ChatCompletionRequestMessage[];
    chats.push({content:message, role:"user"});
    user.chats.push({content:message, role:"user"});

    const config = configureOpenAI();
    const openai = new OpenAIApi(config);

    const chatResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chats
    })
    user.chats.push(chatResponse.data.choices[0].message);
    await user.save();
    return res.status(200).json({message: "Chat generated successfully", chatResponse: chatResponse.data.choices[0].message.content})}}
    catch (error) {
        return res.status(500).json({message:"Something went wrong", error})
    }
}