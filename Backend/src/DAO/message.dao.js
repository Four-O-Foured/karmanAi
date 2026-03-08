import MessageModel from "../model/mesage.model.js";

export const getChatHistory = async (chatId) => {
    return (await MessageModel.find({ chatId }).sort({ createdAt: -1 }).limit(20).lean()).reverse();
};

export const getAllMessagesDAO = async (chatId) => {
    return await MessageModel.find({ chatId }).sort({ createdAt: 1 }).lean();
};