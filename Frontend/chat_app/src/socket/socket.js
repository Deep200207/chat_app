// import { useContext } from "react";
// import { UserContext } from "../context/UserContext";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

// const {user}= useContext(UserContext)
// const navigate= useNavigate()
const user = JSON.parse(localStorage.getItem("chat_user"))
console.log(user?.email)
const socket= io("https://chat-app-backend-x8nu.onrender.com",{
    query:{userid: user?.email}
})
export default socket;