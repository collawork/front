import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationList = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);

    // 알림 목록 불러오기
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const userIdValue = typeof userId === 'object' && userId !== null ? userId.userId : userId;
    
                console.log("알림 요청 token:", token);
                console.log("알림에서 전달되는 userId 값:", userIdValue);
    
                const response = await axios.get(`http://localhost:8080/api/notifications/unread`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    params: { userId: userIdValue },
                });
                setNotifications(response.data);
            } catch (error) {
                console.error('알림을 불러오는 중 오류 발생:', error);
            }
        };
    
        fetchNotifications();
    }, [userId]);

    // 친구 요청 수락 핸들러
    const handleAcceptFriendRequest = async (notification) => {
        const requestId = notification.requestId;

        try {
            await axios.post(`http://localhost:8080/api/friends/accept`, null, {
                params: { requestId },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            // 수락 후 알림을 읽음 처리하여 목록에서 제거
            await handleMarkAsRead(notification.id);
            alert("친구 요청을 승인했습니다.");
        } catch (error) {
            console.error("친구 요청 승인 중 오류 발생:", error);
        }
    };

    // 알림 읽음 처리 핸들러
    const handleMarkAsRead = async (notificationId) => {
        try {
            await axios.post(`http://localhost:8080/api/notifications/markAsRead/${notificationId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setNotifications(prevNotifications =>
                prevNotifications.filter(notification => notification.id !== notificationId)
            );
        } catch (error) {
            console.error('알림을 읽음 처리 중 오류 발생:', error);
        }
    };

    // 친구 요청 거절 핸들러
    const handleRejectFriendRequest = async (notification) => {
        const requesterId = notification.requestId;
        const responderId = userId;

        if (requesterId === responderId) {
            console.error("자기 자신에게 친구 요청을 거절할 수 없습니다.");
            alert("자기 자신에게 친구 요청을 거절할 수 없습니다.");
            return;
        }

        try {
            await axios.post(`/api/friends/reject`, null, {
                params: { 
                    requesterId: requesterId, 
                    responderId: responderId 
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // 거절 후 알림 목록에서 해당 알림 제거
            setNotifications(prevNotifications =>
                prevNotifications.filter(noti => noti.id !== notification.id)
            );
            alert("친구 요청을 거절했습니다.");
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
                        
                        {/* 'isActionCompleted'에 따라 버튼 표시 */}
                        {notification.isActionCompleted || notification.message.includes("친구 요청을 수락했습니다") ? (
                            <button onClick={() => handleMarkAsRead(notification.id)}>읽음 처리</button>
                        ) : (
                            notification.type === 'FRIEND_REQUEST' && (
                                <>
                                    <button onClick={() => handleAcceptFriendRequest(notification)}>승인</button>
                                    <button onClick={() => handleRejectFriendRequest(notification)}>거절</button>
                                    <button onClick={() => handleMarkAsRead(notification.id)}>읽음 처리</button>
                                </>
                            )
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationList;
