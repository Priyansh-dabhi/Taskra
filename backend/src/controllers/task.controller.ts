import { Response } from "express";
import { isValidObjectId } from "mongoose";
import Task from "../models/task.model.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const tasks = await Task.find({ user: req.user?.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: tasks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch tasks",
        });
    }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description } = req.body as {
            title?: string;
            description?: string;
        };

        if (!title || !title.trim()) {
            res.status(400).json({
                success: false,
                message: "Title is required",
            });
            return;
        }

        const task = await Task.create({
            title: title.trim(),
            description: description?.trim() || undefined,
            user: req.user?.id,
        });

        res.status(201).json({
            success: true,
            data: task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to create task",
        });
    }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid task id",
            });
            return;
        }

        const task = await Task.findOne({ _id: id, user: req.user?.id });

        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }

        const { title, description, completed } = req.body as {
            title?: string;
            description?: string;
            completed?: boolean;
        };

        if (title !== undefined) {
            if (!title.trim()) {
                res.status(400).json({
                    success: false,
                    message: "Title cannot be empty",
                });
                return;
            }

            task.title = title.trim();
        }

        if (description !== undefined) {
            task.description = description.trim() || undefined;
        }

        if (completed !== undefined) {
            task.completed = completed;
        }

        const updatedTask = await task.save();

        res.status(200).json({
            success: true,
            data: updatedTask,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to update task",
        });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid task id",
            });
            return;
        }

        const task = await Task.findOne({ _id: id, user: req.user?.id });

        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to delete task",
        });
    }
};
