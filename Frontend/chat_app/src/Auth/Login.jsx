import React, { useContext, useEffect } from 'react'
import { MessageCircle, LogInIcon ,Smartphone } from 'lucide-react'
import { signInWithGoogle } from './auth'
import { useState } from 'react'
import { auth, googleProvider } from '../FireBase'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { UserContext } from '../context/UserContext.jsx'
// import { json } from 'express'

export default function Login() {
    const navigate= useNavigate();
    const {setUser}= useContext(UserContext);
    const handleClick = async ()=>{
        try{
            const result= await signInWithGoogle(auth,googleProvider);
            // console.log(result)
            const user= result
            await axios.post("https://chat-app-backend-x8nu.onrender.com/api/user/firebase-login",{
                firebaseUid:user.uid,
                username: user.displayName,
                email: user.email,
                profilePic: user.photoURL
            })
            await setUser(user)
            localStorage.setItem("chat_user",JSON.stringify(user))
            await navigate("/")
        }catch{
            alert("No Internet")
        }
    }
    return (
        <>
            <div className='h-screen w-screen flex md:grid md:grid-cols-2 justify-center bg-black via-green-950 to-green-600 
            bg-gradient-to-br text-white'>
                <div className='md:flex justify-center hidden '>
                    <div className='md:m-50'>
                        <Smartphone  
                        className='w-45 h-45 text-green-400 animate-pulse drop-shadow-green'></Smartphone>
                    </div>
                </div>
                <div className=''>
                    <div className='flex justify-center mt-20 md:mt-25 text-green '>
                        <MessageCircle size={50} color='lime' />
                    </div>
                    <div>
                        <h1 className='tracking-wider md:font-mono font-bold text-5xl text-white text-shadow-lime-400 text-shadow-md
                    p-1 m-3 md:m-5 text-center
                    '>Web-ChatApp</h1>
                        <h1 className='text-md tracking-wide font-mono
                    text-teal-500 text-center text-shadow-lime-900 text-shadow-md  mt-12'>Start Chat With Your Friends By Click Login Below</h1>
                        <div className=''>
                            <h1 className='text-center font-semibold font-mono tracking-widest text-teal-400 mt-10
                   '> Login with Google</h1>
                            <div className='text-center font-bold justify-center flex mt-5'>
                                <button className='bg-green-500 p-2 rounded-full  '
                                onClick={()=>handleClick()}>
                                    <LogInIcon size={40} className='text-glow' ></LogInIcon>
                                </button>
                                
                            </div>
                        </div>
                    </div>
                    {/* {user.name} */}
                </div>
            </div>
        </>
    )
}
