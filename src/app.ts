import express, { Express } from "express";
import cors from "cors";
import path from "path";

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
import geminiRoutes from "@routes/gemini.routers";

const app: Express = express();

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://your-frontend.com",
];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true, // allow sending refresh token cookies
    })
);
app.use(express.json());

// Serve static files from storage directory
app.use("/storage", express.static(path.join(process.cwd(), "storage")));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/knowledges", knowledgeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/gemini", geminiRoutes);
app.use(errorHandler);

app.get("/", (_req, res) => {
    res.send("Welcome to the IPTE Backend API");
});
(BigInt.prototype as any).toJSON = function () {
    return Number(this);
};
setupSwagger(app);

export default app;
