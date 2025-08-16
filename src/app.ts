import express, { Application } from "express";
import * as bodyParser from "body-parser";
import cors from "cors";

import userRoutes from "./routes/user.routes"; // import route user

const app: Application = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("Welcome to IPTE Backend API 🚀");
});

export default app;
