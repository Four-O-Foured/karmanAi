import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

app.use("/api/auth", userRoutes);
app.use("/api/chat", chatRoutes);


app.use(errorMiddleware);
export default app;