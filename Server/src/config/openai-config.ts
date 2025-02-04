import { GoogleGenerativeAI } from "@google/generative-ai";
export const  configureOpenAI = () => {
    const config = new GoogleGenerativeAI (`${process.env.OPEN_AI_SECRET}`)
    const model = config.getGenerativeModel({ model: "gemini-1.5-flash" });
    return model;
}