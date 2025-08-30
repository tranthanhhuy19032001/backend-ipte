import express, { Application } from "express";
import * as bodyParser from "body-parser";
import cors from "cors";

import errorHandler from "@middlewares/errorHandler";

import userRoutes from "@routes/user.routes";
import authRoutes from "@routes/auth.routes";

const app: Application = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(errorHandler);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("Welcome to IPTE Backend API 🚀");
});

export default app;
