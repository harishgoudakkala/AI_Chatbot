import { Router } from "express";
import { getAllUsers, logoutUser, userLogin, userSignup,verifyUser } from "../Controllers/user-controllers.js";
import {validate, signupValidator, loginValidator} from "../Utils/validatiors.js";
import { verifyToken } from "../Utils/token-manager.js";

const  userRoutes = Router();

userRoutes.get("/", getAllUsers );
userRoutes.post("/signUp", validate(signupValidator),userSignup );
userRoutes.post("/login", validate(loginValidator), userLogin)
userRoutes.get("/logout", verifyToken, logoutUser)
userRoutes.post("/auth-status",verifyToken, verifyUser )


export default userRoutes;