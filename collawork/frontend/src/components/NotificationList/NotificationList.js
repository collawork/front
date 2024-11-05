// NotificationList.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/Axios';

const NotificationList = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axiosInstance.get(`/notifications/unread`, {
                    params: { userId },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // 토큰이 누락되었을 경우 추가
                    }
                });
                setNotifications(response.data);
            } catch (error) {
                console.error('알림을 불러오는 중 오류 발생:', error);
            }
        };

        fetchNotifications();
    }, [userId]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await axiosInstance.post(`/notifications/markAsRead/${notificationId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setNotifications(notifications.filter(notification => notification.id !== notificationId));
        } catch (error) {
            console.error('알림을 읽음 처리 중 오류 발생:', error);
        }
    };

    if (notifications.length === 0) {
        return <p>새로운 알림이 없습니다.</p>;
    }

    return (
        <div className="notification-list">
            <h3>새로운 알림</h3>
            <ul>
                {notifications.map(notification => (
                    <li key={notification.id}>
                        <span>{notification.message}</span>
                        <button onClick={() => handleMarkAsRead(notification.id)}>읽음 처리</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationList;
