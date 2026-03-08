import { asyncHandler } from "../utils/asyncHandler.js";
import { createChatDAO, getChatsDAO } from "../DAO/chat.dao.js";
import { getAllMessagesDAO } from "../DAO/message.dao.js";

export const createChat = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const chat = await createChatDAO({ title, user: req.user._id });
    res.json(chat);
});

export const getChats = asyncHandler(async (req, res) => {
    const chats = await getChatsDAO(req.user._id);
    res.json(chats);
});

export const getAllMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const messages = await getAllMessagesDAO(chatId);
    res.json(messages);
});
