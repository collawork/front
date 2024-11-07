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

    const handleAcceptFriendRequest = async (notification) => {
        // 요청을 보낸 사용자 ID는 별도로 저장된 requestId를 사용하거나, 백엔드에서 올바르게 전달된 정보를 사용해야 함
        const requesterId = notification.requestId; // 알림에서 올바른 요청자 ID를 참조하도록 수정함
    
        // 현재 로그인된 사용자 ID
        const responderId = userId;
    
        console.log("승인할 친구 요청 requesterId:", requesterId);
        console.log("현재 사용자 responderId:", responderId);
    
        // 요청자나 응답자의 ID가 null인 경우 처리 중단
        if (requesterId === null || responderId === null) {
            console.error("요청자 또는 응답자 ID가 올바르지 않습니다.");
            return;
        }
    
        // 요청자와 응답자가 같은 경우 처리 방지할라고
        if (requesterId === responderId) {
            console.error("자기 자신에게 친구 요청을 수락할 수 없습니다.");
            alert("자기 자신에게 친구 요청을 수락할 수 없습니다.");
            return;
        }
    
        try {
            await axios.post(`http://localhost:8080/api/friends/accept`, null, {
                params: { 
                    requesterId: requesterId,
                    responderId: responderId
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
    
            // 승인된 친구 요청 알림 제거
            setNotifications(prevNotifications =>
                prevNotifications.filter(n => n.id !== notification.id)
            );
            alert("친구 요청을 승인했습니다.");
        } catch (error) {
            console.error("친구 요청 승인 중 오류 발생:", error);
        }
    };
    
    const handleRejectFriendRequest = async (notification) => {
        const requesterId = notification.user.id;
        const responderId = userId;
    
        // 거절할 때 요청자와 응답자가 같은 경우 방지
        if (requesterId === responderId) {
            console.error("자기 자신에게 친구 요청을 거절할 수 없습니다.");
            alert("자기 자신에게 친구 요청을 거절할 수 없습니다.");
            return;
        }
    
        try {
            await axios.post(`http://localhost:8080/api/friends/reject`, null, {
                params: { 
                    requesterId: requesterId,
                    responderId: responderId 
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setNotifications(prevNotifications =>
                prevNotifications.map(noti =>
                    noti.id === notification.id ? { ...noti, isActionCompleted: true } : noti
                )
            );
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
                        {notification.type === 'FRIEND_REQUEST' && !notification.isActionCompleted && (
                            <>
                                <button onClick={() => handleAcceptFriendRequest(notification)}>승인</button>
                                <button onClick={() => handleRejectFriendRequest(notification)}>거절</button>
                            </>
                        )}
                        <button onClick={() => handleMarkAsRead(notification.id)}>읽음 처리</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationList;
