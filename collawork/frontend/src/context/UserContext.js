import React, { createContext, useContext, useEffect, useState } from 'react';

// userId 전역에서 관리 하기 위함
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // 로컬 스토리지에서 userId를 가져와 초기값 설정
    const [userId, setUserId] = useState(() => localStorage.getItem('userId'));

    useEffect(() => {
        // userId가 업데이트될 때마다 localStorage에 저장
        if (userId) {
            localStorage.setItem('userId', userId);
        }
    }, [userId]);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

// 사용자 정보를 사용하는 커스텀 Hook임
export const useUser = () => useContext(UserContext);
