import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { MessageCircle, UserCircle2, SendHorizonal, LogOut 
  
} from 'lucide-react'
import { io } from 'socket.io-client'
import socket from '../socket/socket'
import { signOut } from 'firebase/auth'
import { auth } from '../FireBase'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function () {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  // const users=JSON.parse(user)
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState([])
  const [selected, setSelected] = useState(null)
  const [toggle, setToggle] = useState(false)

  const [input, setInput] = useState("")

  const logout = async () => {
    await signOut(auth)
    localStorage.removeItem('chat_user')
    navigate("/login")
  }

  useEffect(() => {
    const fetchUser = async () => {
      const users = await axios(`https://chat-app-backend-x8nu.onrender.com/api/get/user?email=${user.email}`)
      console.log(users)
      setFriends(users.data)
    }
    fetchUser()
  }, [])
  useEffect(() => {
    socket.emit("register", user?.email);
  }, [user]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessage((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(
        `https://chat-app-backend-x8nu.onrender.com/message/${user?.email}/${selected?.email}`
      );
      // console.log(res.data)
      setMessage(res.data);
    };
    fetchMessages();
  }, [user?.email, selected?.email]);


  const handleMessage = () => {
    if (!input) {
      return
    }
    socket.emit("send_message", {
      senderId: user?.email,
      receiverId: selected?.email,
      message: input,
    });
    // setMessage("");
    setInput("")

  }
  // console.log(user)
  return (
    <div>
      <header className='bg-green-600 w-full sticky top-0 '>
        <div className='flex w-full justify-between'>
          <div className='flex md:gap-2 md:p-2 '>
            <MessageCircle size={30} color='white' className='md:mt-0 mt-1'></MessageCircle>
            <h1 className='text-xs mt-3 md:mt-0 md:text-xl md:tracking-widest text-white md:p-1
            '>Web Chat</h1>
          </div>
          <div className='md:p-2 flex'>
            <UserCircle2 color='white' size={30} className='mt-1 md:mt-2'></UserCircle2>
            <h1 className='text-white mt-3 md:mt-0 md:p-2 text-xs md:text-lg '>{user.displayName}</h1>
            <div className='flex m-1 md:m-0 md:p-1 bg-red-400 md:rounded-xl text-white md:ml-2'>
              <h1 className='p-2 font-semibold text-xs md:text-sm'>Log-Out</h1>
              <button onClick={() => logout()} className='bg-white rounded-full'>
                <LogOut size={25} color='black' className='m-1'></LogOut>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className='md:flex'>
        <div className=' bg-slate-100 h-130 overflow-scroll md:w-[40%] hidden '>
          <h1 className=' text-xl bg-white p-2 text-center
          z-10  fixed md:w-[40%] w-full'>Your Friends</h1>
          <div className='mt-12 '></div>
          {friends.map((item, index) => {
            return (
              <div key={index} className='w-full bg-gray-300 p-2 mt-1 mb-1  flex'
                onClick={() => {
                  setSelected(item)
                  setToggle(true)
                }}>
                <UserCircle2 color='black' className='m-1' size={40}></UserCircle2>
                <div>
                  <h1 className='md:text-lg p-2'>{item.username}</h1>
                  {/* <h1 className='text-xs '>{item.email}</h1> */}
                </div>
                {/* <h1 className='text-xs '>{item.email}</h1> */}
              </div>
            )
          })}
        </div>
        {!toggle && <div className=' bg-slate-100 h-130 overflow-scroll md:hidden w-full '>
          <h1 className=' text-xl bg-white p-2 text-center
          z-10  fixed md:w-[40%] w-full'>Your Friends</h1>
          <div className='mt-12 '></div>
          {friends.map((item, index) => {
            return (
              <div key={index} className='w-full bg-gray-300 p-2 mt-1 mb-1  flex'
                onClick={() => {
                  setSelected(item)
                  setToggle(true)
                }}>
                <UserCircle2 color='black' className='m-1' size={40}></UserCircle2>
                <div>
                  <h1 className='md:text-lg p-2'>{item.username}</h1>
                  {/* <h1 className='text-xs '>{item.email}</h1> */}
                </div>
                {/* <h1 className='text-xs '>{item.email}</h1> */}
              </div>
            )
          })}
        </div>}
        {selected ? <div className='w-[60%] hidden'>
          <div className='w-full h-15 mb-1 mt-1 rounded p-2 bg-emerald-700
          text-white flex'>
            <UserCircle2 size={40} className='m-1'></UserCircle2>
            <h1 className='ml-2 m-2 text-xl'>{selected.username}</h1>
          </div>
          <div className='bg-slate-200 h-102 overflow-auto'>
            {
              message.map((item, index) => {
                return (
                  <div key={index} className={`${item.senderId == `${user.email}` ? 'float-right' : 'float-left'} w-full m-1
                    p-1 `}>
                    <h1 className={`${item.senderId == `${user.email}` ? 'float-right bg-green-500 text-white font-semibold'
                      : 'float-left bg-white border-white'}
                      border-1 p-2  max-w-40 rounded  max-h-30 break-words`}
                    >{item.message}</h1>
                  </div>
                )
              })
            }
          </div>
          <div className='p-1 flex'>
            <input type="text" className='w-full bg-green-900 h-10 rounded p-1 
            text-white font-semibold outline-0 tracking-wider'
              value={input} onChange={(e) => setInput(e.target.value)}
              placeholder='Type Message' />
            <button onClick={() => handleMessage()}><SendHorizonal size={35} className='m-1'></SendHorizonal></button>
          </div>
        </div> :
          <div className='md:flex justify-center h-120 items-center w-[60%] hidden'>
            <div>
              <h1 className='text-center text-3xl tracking-wider'>Select on Friend </h1>
              <h1 className='text-center text-2xl tracking-widest'>To Chat</h1>
            </div>
          </div>}
          {/* Mobile View */}
        {toggle ? <div className='w-full md:hidden'>
          <div className='w-full h-10 mb-1 mt-1 p-2 bg-emerald-700
          text-white flex'>
            <UserCircle2 size={30} className=''></UserCircle2>
            <h1 className='ml-2 m-1 text-sm'>{selected.username}</h1>
            <div>

            </div>
          </div>
          <div className='bg-slate-200 h-102 overflow-auto'>
            {
              message.map((item, index) => {
                return (
                  <div key={index} className={`${item.senderId == `${user.email}` ? 'float-right' : 'float-left'} w-full m-1
                    p-1 `}>
                    <h1 className={`${item.senderId == `${user.email}` ? 'float-right bg-green-500 text-white font-semibold'
                      : 'float-left bg-white border-white'}
                      border-1 p-2  max-w-40 rounded  max-h-30 break-words`}
                    >{item.message}</h1>
                  </div>
                )
              })
            }
          </div>
          <div className='p-1 flex'>
            <input type="text" className='w-full bg-green-900 h-10 rounded p-1 
            text-white font-semibold outline-0 tracking-wider'
              value={input} onChange={(e) => setInput(e.target.value)}
              placeholder='Type Message' />
            <button onClick={() => handleMessage()}><SendHorizonal size={35} className='m-1'></SendHorizonal></button>
          </div>
        </div> :
          <div className='md:flex justify-center h-120 items-center w-[60%] hidden'>
            <div>
              <h1 className='text-center text-3xl tracking-wider'>Select on Friend </h1>
              <h1 className='text-center text-2xl tracking-widest'>To Chat</h1>
            </div>
          </div>}
      </main>
    </div>
  )
}
