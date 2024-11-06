import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationList = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/notifications/unread`, {
                    params: { userId },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
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
            await axios.post(`http://localhost:8080/api/notifications/markAsRead/${notificationId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setNotifications(notifications.filter(notification => notification.id !== notificationId));
        } catch (error) {
            console.error('알림을 읽음 처리 중 오류 발생:', error);
        }
    };

    const handleAcceptFriendRequest = async (friendRequestId) => {
        console.log("승인할 친구 요청 ID:", friendRequestId);
        try {
            await axios.post(`http://localhost:8080/api/friends/accept`, null, {
                params: { requestId: friendRequestId },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            // 성공 시 친구 목록을 새로고침
            setNotifications(notifications.filter(notification => notification.id !== friendRequestId));
            // 친구 목록 새로고침 로직 추가 필요
        } catch (error) {
            console.error("친구 요청 승인 중 오류 발생:", error);
        }
    };

    const handleRejectFriendRequest = async (friendRequestId) => {
        try {
            await axios.post(`http://localhost:8080/api/friends/reject`, null, {
                params: { requestId: friendRequestId },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setNotifications(notifications.filter(notification => notification.id !== friendRequestId));
        } catch (error) {
            console.error('친구 요청 거절 중 오류 발생:', error);
        }
    };

    return (
        <div className="notification-list">
            <h3>새로운 알림</h3>
            <ul>
                {notifications.map(notification => (
                    <li key={notification.id}>
                        <span>{notification.message}</span>
                        {notification.type === 'FRIEND_REQUEST' && notification.friendRequestId && (
                            <>
                                <button onClick={() => handleAcceptFriendRequest(notification.friendRequestId)}>승인</button>
                                <button onClick={() => handleRejectFriendRequest(notification.friendRequestId)}>거절</button>
                            </>
                        )}
                        <button onClick={() => handleMarkAsRead(notification.id)}>읽음 처리</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NotificationList;
