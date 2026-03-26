import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      unique: true,
    },
    username: String,
    email: String,
    profilePic: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);