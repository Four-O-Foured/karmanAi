import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

app.use("/api/auth", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(express.static(
    path.join(__dirname, "../public")
));

app.get("*name", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use(errorMiddleware);
export default app;