import React from 'react'
import Home from './Pages/Home.jsx'
import Login from './Auth/Login.jsx'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.jsx'

export default function App() {

    return (
        <>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/' element={<ProtectedRoute><Home></Home></ProtectedRoute>}>
                </Route>
            </Routes>
        </>
    )
}
