import React, { createContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

 export const UserContext = createContext();

const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(user) return;

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
            } catch (error) {
                // 401 means no valid session; not an unexpected error
                if (!error.response || error.response.status !== 401) {
                    console.error('Error fetching user data:', error);
                }
                clearUser();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }
    , []);

    const updateUser = (userData) => {  
        setUser(userData);
        setLoading(false);
    };

    const clearUser = () => {
        setUser(null);
    };

    const logoutUser = async () => {
        try {
            await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
        } catch {
            // Ignore errors — clear the local state regardless
        }
        clearUser();
    };

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;