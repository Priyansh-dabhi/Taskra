import { Schema, Types, model } from "mongoose";

export interface ITask {
    title: string;
    description?: string;
    completed: boolean;
    user: Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Task = model<ITask>("Task", taskSchema);

export default Task;
