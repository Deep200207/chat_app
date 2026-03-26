import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    message: String,
    createdAt: Date
})
export default mongoose.model("Message",messageSchema)