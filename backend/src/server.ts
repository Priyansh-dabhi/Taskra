import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);

        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect database:", error);

        process.exit(1);
    }
};

startServer();