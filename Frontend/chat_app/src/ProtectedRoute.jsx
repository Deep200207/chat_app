import React from 'react'
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({children}) {
    const isLogged= localStorage.getItem("chat_user");
  return isLogged ? children : <Navigate to={"/login"}/>
}
