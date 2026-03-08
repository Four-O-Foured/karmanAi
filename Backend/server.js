import app from "./src/app.js";
import { connectDB } from "./src/db/db.js";
import dotenv from "dotenv";
import setupSocketServer from "./src/sockets/socket.server.js";
import { createServer } from "http";
dotenv.config();

connectDB();
const httpServer = createServer(app);

setupSocketServer(httpServer);

httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});