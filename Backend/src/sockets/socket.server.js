import { Server } from "socket.io";
import cookie from "cookie";
import { verifyToken } from "../utils/helper.js";
import { findUserById } from "../DAO/user.dao.js";
import { ApiError } from "../utils/ApiError.js";
import generateResponse, { generateVectors } from "../services/ai.service.js";
import MessageModel from "../model/mesage.model.js";
import { createMemory, queryResponse } from "../services/vectors.service.js";
import { getChatHistory } from "../DAO/message.dao.js";


function setupSocketServer(httpServer) {
    const activeChats = new Set();

    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        },
    });
    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        if (!cookies.accessToken) {
            return next(new ApiError(401, "Authentication error"));
        }
        const token = cookies.accessToken;
        if (token) {
            try {
                const decoded = verifyToken(token);

                const user = await findUserById(decoded.id);

                socket.user = user;
                next();
            } catch (error) {
                next(new ApiError(401, "Authentication error"));
            }
        } else {
            next(new ApiError(401, "Authentication error"));
        }
    });

    io.on("connection", (socket) => {

        

        console.log("User connected", socket.user);

        socket.on("ai-message", async ({ chatId, message }) => {
            if (!message || !chatId) {
                return socket.emit("ai-error", { error: "Invalid input parameters" });
            }

            if (activeChats.has(chatId)) {
                return socket.emit("ai-error", {
                    error: "Please wait for the current response to finish."
                });
            }
            activeChats.add(chatId);

            try {
                // Step 1: Concurrently save user message and vectorize
                const [userMessage, vectors] = await Promise.all([
                    MessageModel.create({
                        chatId,
                        userId: socket.user._id,
                        content: message,
                        role: "user",
                    }),
                    generateVectors(message),
                ]);

                // Step 2: Grab history & semantic matches
                const [memory, chatHistory] = await Promise.all([
                    queryResponse(vectors, { user: socket.user._id.toString() }),
                    getChatHistory(chatId),
                ]);

                // Step 3: Upsert Pinecone (Safely cast ObjectId to String)
                await createMemory({
                    vectors,
                    metadata: {
                        chatId: chatId.toString(),
                        user: socket.user._id.toString(),
                        text: message,
                    },
                    messageId: userMessage._id.toString()
                });

                const stm = chatHistory.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.content }],
                }));

                const ltmContext = memory.matches.map(match => match.metadata.text).join("\n");
                const ltm = [{
                    role: "user",
                    parts: [{ text: `Previous context:\n${ltmContext}` }]
                }];

                // Optional, but recommended: If you can stream this, change it to stream chunks
                const response = await generateResponse([...ltm, ...stm]);

                socket.emit("ai-response", { chatId, response });

                // Step 4: Save AI response
                const [aiMessage, resVectors] = await Promise.all([
                    MessageModel.create({
                        chatId,
                        userId: socket.user._id,
                        content: response,
                        role: "model",
                    }),
                    generateVectors(response),
                ]);

                await createMemory({
                    vectors: resVectors,
                    metadata: {
                        chatId: chatId.toString(),
                        user: socket.user._id.toString(),
                        text: response,
                    },
                    messageId: aiMessage._id.toString()
                });

            } catch (error) {
                console.error("Chat generation failed:", error);
                // Important: Tell the client something went wrong so they aren't stuck waiting
                socket.emit("ai-error", {
                    chatId,
                    error: "We could not generate a response right now. Please try again."
                });
            } finally {
                activeChats.delete(chatId);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
        });
    });
}

export default setupSocketServer;