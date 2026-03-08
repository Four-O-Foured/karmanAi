import express from "express";
import { createChat, getChats, getAllMessages } from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createChat);
router.get("/", authMiddleware, getChats);
router.get("/:chatId/messages", authMiddleware, getAllMessages);

export default router;