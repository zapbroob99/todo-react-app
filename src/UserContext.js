import React, { createContext, useState, useContext } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Mock function to simulate login and set user data
    const login = async (username, password) => {
        // Perform login request here
        const userData = { id: 1, username: 'user' }; // Replace with actual login response
        setUser(userData);
    };

    return (
        <UserContext.Provider value={{ user, setUser, login }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
