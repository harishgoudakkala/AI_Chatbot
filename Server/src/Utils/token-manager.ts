import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (
    id: string,
    email: string,
    expiresIn: SignOptions["expiresIn"]
) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    const payload = { id, email };

    const token = jwt.sign(payload, secret, { expiresIn });

    return token;
};

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.signedCookies[COOKIE_NAME];

    if (!token || token.trim() === "") {
        return res.status(401).json({
            message: "No token found"
        });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        return res.status(500).json({
            message: "JWT_SECRET is not configured"
        });
    }

    return new Promise<void>((resolve, reject) => {
        jwt.verify(
            token,
            secret,
            (err: jwt.VerifyErrors | null, success: string | JwtPayload | undefined) => {
                if (err) {
                    reject(err);
        
                    return res.status(403).json({
                        message: "Token is invalid or expired"
                    });
                }
        
                res.locals.jwtData = success;
                resolve();
        
                return next();
            }
        );
    });
};