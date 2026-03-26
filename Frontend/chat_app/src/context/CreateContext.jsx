import { useState } from "react";

import React from 'react'
import { UserContext } from "./UserContext";

export default function CreateContext({children}) {
    
    const [user,setUser]=useState(JSON.parse(localStorage.getItem("chat_user"))||null);
    return (
        <UserContext.Provider value={{user,setUser}}>
            {children}
        </UserContext.Provider>
    )
}
