import express, { Express } from "express";
import * as bodyParser from "body-parser";
import cors from "cors";

import { setupSwagger } from "@config/swagger";

import errorHandler from "@middlewares/errorHandler";

import userRoutes from "@routes/user.routes";
import authRoutes from "@routes/auth.routes";
import aboutRoutes from "@routes/about.routes";

import courseRoutes from "@routes/course.routes";
import teacherRoutes from "@routes/teacher.routes";
import newsRoutes from "@routes/news.routes";
import consultationRoutes from "@routes/consultation.routes";
import knowledgeRoutes from "@routes/knowledge.routes";
import categoryRoutes from "@routes/category.routes";

const app: Express = express();

// Middleware
app.use(
    cors({
        origin: ["http://localhost:3000", "https://your-frontend.com"],
        credentials: true, // để cookie 'rt' gửi kèm
    })
);
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/knowledges", knowledgeRoutes);
app.use("/api/categories", categoryRoutes);

app.use(errorHandler);

// Default route
app.get("/", (req, res) => {
    res.send("Welcome to IPTE Backend API 🚀");
});

setupSwagger(app);

export default app;
