import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationList = ({ userId, fetchFriends }) => {
    const [notifications, setNotifications] = useState([]);

    // 알림 목록 불러오기
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const userIdValue = typeof userId === 'object' && userId !== null ? userId.userId : userId;

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
        const { requestId } = notification;

        if (!requestId || !userId) {
            console.error("requestId 또는 responderId가 누락되었습니다:", { requestId, responderId: userId });
            return;
        }

        try {
            await axios.post(`http://localhost:8080/api/friends/accept`, null, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                params: {
                    requestId,
                    responderId: userId
                }
            });

            alert("친구 요청을 승인했습니다.");

            // 알림을 읽음 처리하여 목록에서 제거
            await handleMarkAsRead(notification.id);

            // 친구 목록 새로고침
            if (fetchFriends) fetchFriends();

        } catch (error) {
            console.error("친구 요청 승인 중 오류 발생:", error);
        }
    };

    // 알림 읽음 처리 함수
    const handleMarkAsRead = async (notificationId) => {
        try {
            await axios.post(`http://localhost:8080/api/notifications/markAsRead/${notificationId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            // 읽음 처리 후 알림 목록에서 제거
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

        if (!requesterId || requesterId === responderId) {
            console.error("잘못된 요청: 자기 자신에게 친구 요청을 거절할 수 없습니다.");
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
                prevNotifications.filter(noti => noti.id !== notification.id)
            );

            alert("친구 요청을 거절했습니다.");

            // 친구 목록 새로고침
            if (fetchFriends) fetchFriends();

        } catch (error) {
            console.error('친구 요청 거절 중 오류 발생:', error);
        }
    };

    const handleRespondToProjectInvitation = async (notification, action) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }
    
            const response = await axios.post(
                `http://localhost:8080/api/notifications/${notification.id}/respond`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: { action }, // action: 'accept' 또는 'decline'
                }
            );
    
            alert(`프로젝트 초대를 ${action === "accept" ? "승인" : "거절"}했습니다.`);
    
            // 알림 목록 새로고침
            setNotifications((prevNotifications) =>
                prevNotifications.filter((noti) => noti.id !== notification.id)
            );
    
            // 친구 목록 또는 프로젝트 참여자 목록 새로고침
            if (fetchFriends) fetchFriends();
        } catch (error) {
            console.error("프로젝트 초대 응답 처리 중 오류 발생:", error);
        }
    };
    
    
    

    return (
        <div className="notification-list">
            <h3>새로운 알림</h3>
            <ul>
                {notifications.map(notification => (
                    <li key={notification.id}>
                        <span>{notification.message}</span>
                        
                        {notification.isActionCompleted || notification.message.includes("친구 요청을 수락했습니다") ? (
                            <button onClick={() => handleMarkAsRead(notification.id)}>읽음 처리</button>
                        ) : notification.type === 'FRIEND_REQUEST' ? (
                            <>
                                <button onClick={() => handleAcceptFriendRequest(notification)}>승인</button>
                                <button onClick={() => handleRejectFriendRequest(notification)}>거절</button>
                                <button onClick={() => handleMarkAsRead(notification.id)}>읽음 처리</button>
                            </>
                        ) : notification.type === 'PROJECT_INVITATION' ? (
                            <>
                                <button onClick={() => handleRespondToProjectInvitation(notification, 'accept')}>
                                    초대 수락
                                </button>
                                <button onClick={() => handleRespondToProjectInvitation(notification, 'decline')}>
                                    초대 거절
                                </button>
                            </>
                        ) : null}
                    </li>
                ))}
            </ul>
        </div>
    );
    
};

export default NotificationList;
