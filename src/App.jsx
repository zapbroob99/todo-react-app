import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TodoPage from './TodoPage.jsx';
import Register from './Register.jsx';
import Login from './Login.jsx';
import Logout from './Logout.jsx';
import AuthContext from './backend/AuthProvider.jsx';
import { useContext, useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    if (!auth) {
        return <Navigate to="/login" />;
    }

    return children;
};

const App = () => {
    const { auth, setAuth } = useContext(AuthContext);

    useEffect(() => {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
            setAuth(JSON.parse(storedAuth));
        }
    }, [setAuth]);

    return (
        <BrowserRouter>
            <header>
                {auth && <Logout />} {/* Show Logout button only when authenticated */}
            </header>
            <Routes>
                <Route path="/" element={<Navigate to={auth ? "/todo" : "/login"} />} />
                <Route path="/login" element={auth ? <Navigate to="/todo" /> : <Login />} />
                <Route path="/register" element={auth ? <Navigate to="/todo" /> : <Register />} />
                <Route path="/todo" element={<ProtectedRoute><TodoPage /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
