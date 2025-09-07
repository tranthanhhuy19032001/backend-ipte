import express, { Express } from "express";
import * as bodyParser from "body-parser";
import cors from "cors";

import { registerDocs } from "@utils/minimal-docs";

import errorHandler from "@middlewares/errorHandler";

import userRoutes from "@routes/user.routes";
import authRoutes from "@routes/auth.routes";
import aboutRoutes from "@routes/about.routes";
import branchRoutes from "@routes/branch.routes";

import courseRoutes from "@routes/course.routes";

const app: Express = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/branch", branchRoutes);

app.use(errorHandler);

// Default route
app.get("/", (req, res) => {
    res.send("Welcome to IPTE Backend API 🚀");
});

registerDocs(app);

export default app;
