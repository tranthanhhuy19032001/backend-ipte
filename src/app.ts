import express, { Application } from "express";
import * as bodyParser from "body-parser";
import cors from "cors";

import errorHandler from "@middlewares/errorHandler";

import userRoutes from "@routes/user.routes";
import authRoutes from "@routes/auth.routes";

import courseRoutes from "@routes/course.routes";

const app: Application = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

app.use(errorHandler);

// Default route
app.get("/", (req, res) => {
    res.send("Welcome to IPTE Backend API 🚀");
});

export default app;
