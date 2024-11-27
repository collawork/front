import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(() => {
        const storedUserId = localStorage.getItem('userId');
        return storedUserId ? storedUserId : null;
    });

    useEffect(() => {
        if (userId) {
            localStorage.setItem('userId', userId);
        } else {
            localStorage.removeItem('userId');
        }
    }, [userId]);

    return (
        <UserContext.Provider value={{ 
            userId, 
            setUserId: (newUserId) => {
                // 객체가 아닌 userId 값만 설정
                if (typeof newUserId === 'object' && newUserId.userId) {
                    setUserId(String(newUserId.userId));
                } else {
                    setUserId(newUserId ? String(newUserId) : null);
                }
            } 
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
