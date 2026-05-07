import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const createToken = (userId: string, name: string): string => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    return jwt.sign({ userId, name }, jwtSecret, { expiresIn: "7d" });
};

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body as {
            name?: string;
            email?: string;
            password?: string;
        };

        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
            return;
        }

        const trimmedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        if (!trimmedName || !normalizedEmail || !trimmedPassword) {
            res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
            return;
        }

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

        const user = await User.create({
            name: trimmedName,
            email: normalizedEmail,
            password: hashedPassword,
        });

        const token = createToken(user._id.toString(), user.name);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Signup failed",
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body as {
            email?: string;
            password?: string;
        };

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        if (!normalizedEmail || !trimmedPassword) {
            res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
            return;
        }

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        const isPasswordMatch = await bcrypt.compare(trimmedPassword, user.password);

        if (!isPasswordMatch) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
            return;
        }

        const token = createToken(user._id.toString(), user.name);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Login failed",
        });
    }
};
