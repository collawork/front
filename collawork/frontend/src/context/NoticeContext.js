import React, { createContext, useState } from "react";

export const NoticeContext = createContext();

export const NoticeProvider = ({ children }) => {
    const [notices, setNotices] = useState([]); // 공지사항 상태
    const addNotice = (notice) => setNotices((prev) => [notice, ...prev]); // 새 공지 추가
    const updateNotice = (updatedNotice) => {
        setNotices((prev) =>
            prev.map((notice) => (notice.id === updatedNotice.id ? updatedNotice : notice))
        );
    };

    return (
        <NoticeContext.Provider value={{ notices, setNotices, addNotice, updateNotice }}>
            {children}
        </NoticeContext.Provider>
    );
};
