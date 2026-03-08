import Chat from "../model/chat.model.js";

export const createChatDAO = async (chatData) => {
    const chat = await Chat.create(chatData);
    return chat;
};

export const getChatsDAO = async (userId) => {
    const chats = await Chat.find({ user: userId }).sort({ createdAt: -1 });
    return chats;
};