import express from 'express'
import User from '../models/User.js';
import { use } from 'react';

const Loginrouter= express.Router();

Loginrouter.post('/firebase-login', async (req,res)=>{
    try{
        const { firebaseUid,username,email,profilePic}=req.body;
        console.log(email);
        let user= await User.findOne({email});

        if(!user){  
            user= await User.create({
                firebaseUid,
                username,
                email,
                profilePic
            });
        }else{
                user.username=username;
                user.profilePic=profilePic;
                await user.save();
            }
            res.json(user);
            console.log(user)
        }catch(error){
            res.status(500).json({error:error.message})
        }
    }
)
export default Loginrouter;