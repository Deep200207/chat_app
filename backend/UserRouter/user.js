import { Router } from "express";

import User from "../models/User.js";

const UserRoute= Router();

UserRoute.get("/user",async (req,res)=>{
    const {email} = req.query
    const user= await User.find({email:{$ne:email}})
    res.status(200).json(user)
})

export default UserRoute;