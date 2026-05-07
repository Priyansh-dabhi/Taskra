import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: string;
    name: string;
    iat?: number;
    exp?: number;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Authorization token is missing",
            });
            return;
        }

        const token = authHeader.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        req.user = {
            id: decoded.userId,
        };

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error instanceof Error ? "Invalid or expired token" : "Unauthorized",
        });
    }
};

export default authMiddleware;
