import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from "./config/db.js";
import Loginrouter from "./LoginRouter/Login.js";
import UserRoute from "./UserRouter/user.js";
import Message from "./models/Message.js";

const app = express();
dotenv.config()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())

connectDB()

app.use("/api/user", Loginrouter)
app.use("/api/get", UserRoute)

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["*"],
        credentials: true
    }
});
const user = {};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userid;
    console.log("User Connected", userId);
    socket.on("register", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });
    socket.on("send_message", async ({ senderId, receiverId, message }) => {
        try {
            // 1. Save to DB
            const newMessage = await Message.create({
                senderId,
                receiverId,
                message,
            });

            // 2. Send to receiver
            io.to(receiverId).emit("receive_message", newMessage);

            // 3. Send back to sender (optional)
            io.to(senderId).emit("receive_message", newMessage);

        } catch (err) {
            console.error(err);
        }
    });
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
})

app.get("/message/:user1/:user2", async (req, res) => {
    const { user1, user2 } = req.params;
    const message = await Message.find({
        $or: [
            { senderId: user1, receiverId: user2 },
            { senderId: user2, receiverId: user1 }
        ]
    }).sort({ createdAt: 1 })
    res.json(message)
})
server.listen(3000, () => {
    console.log("server running at port 3000")
})