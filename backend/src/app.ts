import express, { Application, Request, Response } from "express";
import cors from "cors";

// Routes
// import authRoutes from "./routes/authRoutes";
// import taskRoutes from "./routes/taskRoutes";

const app: Application = express();

// Middleware
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Health Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Task Tracker API Running",
  });
});

// Routes
// app.use("/auth", authRoutes);

// app.use("/tasks", taskRoutes);

export default app;