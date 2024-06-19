import "./styles.css"
import {useContext, useEffect, useState} from "react";

import Register from "./Register.jsx"
import Login from "./Login.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TodoPage from "./TodoPage.jsx";
import AuthContext from "./backend/AuthProvider.jsx";

const ProtectedRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    // Redirect to login if user is not authenticated
    if (!auth) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default function App() {


    const { auth, setAuth } = useContext(AuthContext);

    useEffect(() => {
        // Retrieve stored authentication status
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
            setAuth(JSON.parse(storedAuth));
        }
    }, [setAuth]);

    return ( //renders todopage or login page depending on whether user is logged in or not. it is handled by authprovider.js
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={auth ? "/todo" : "/login"} />} />
                <Route path="/login" element={auth ? <Navigate to="/todo" /> : <Login />} />
                <Route path="/register" element={auth ? <Navigate to="/todo" /> : <Register />} />
                <Route path="/todo" element={<ProtectedRoute><TodoPage /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
}
