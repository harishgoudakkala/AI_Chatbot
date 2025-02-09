import { Request, Response, NextFunction } from "express";
import { hash, compare} from "bcrypt"
import User from "../Models/User.js";
import { createToken } from "../Utils/token-manager.js";
import {COOKIE_NAME} from "../Utils/constants.js";

export const getAllUsers = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find();
        return res.status(200).json({message: "OK", users})
    }catch (err) {
        console.log(err);
        return res.status(400).json({message: "ERROR", cause: err.message})
    }
}

export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email: email});
        //console.log(existingUser)
        if(existingUser) return res.status(401).json({message: "User already exists"})
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        
        res.clearCookie(COOKIE_NAME, {
            path: "/",
            domain: "localhost",
            httpOnly: true,
            signed: true
        })
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);                                                                                       
        res.cookie(COOKIE_NAME, token, {path: "/", domain: "localhost", expires, httpOnly: true, signed: true});

        return res.status(201).json({message: "User created successfully", user})
    }catch (err) {
        console.log(err);
        return res.status(400).json({message: "ERROR", cause: err.message})
    }
}

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {email, password} = req.body;
        const existingUser =  await User.findOne({email:email})
        if(!existingUser) return res.status(401).json({message: "User not found"});
        const isPasswordCorrect = await compare(password, existingUser.password) ;
        if(!isPasswordCorrect) return res.status(401).json({message: "Invalid credentials"});

        res.clearCookie(COOKIE_NAME, {
            path: "/",
            domain: "localhost",
            httpOnly: true,
            signed: true
        })
        
        const token = createToken(existingUser._id.toString(), existingUser.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);                                                                                       
        res.cookie(COOKIE_NAME, token, {path: "/", domain: "localhost", expires, httpOnly: true, signed: true});
        return res.status(200).json({message: "Logged in successfully", user: existingUser})
    }catch(err){
        console.log(err);
        return res.status(400).json({message: "ERROR", cause: err.message})
    }
}

export const verifyUser =  async (req: Request, res:Response, next:NextFunction) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if(!user) return res.status(401).json({message: "User not found"});
        if(user._id.toString() !== res.locals.jwtData.id) return res.status(401).json({message: "Permission denied"});
        return res.status(200).json({message: "User verified", user})
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: "User verification failed"});
    }
}

export const logoutUser =  async (req: Request, res:Response, next:NextFunction) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if(!user) return res.status(401).json({message: "User not found"});
        if(user._id.toString() !== res.locals.jwtData.id) return res.status(401).json({message: "Permission denied"});
        res.clearCookie(COOKIE_NAME,{
            httpOnly: true,
            path: "/",
            domain: "localhost",
            secure: false,
            sameSite: "lax"
        })
        return res.status(200).json({message: "OK"});
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: "User verification failed"});
    }
}