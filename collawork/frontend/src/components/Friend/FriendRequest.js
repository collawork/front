import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendRequest = ({ currentUser, selectedUserId }) => {
    const [friendshipStatus, setFriendshipStatus] = useState(null);
    const [isRequester, setIsRequester] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchFriendStatus = async () => {
        if (!currentUser?.id || !selectedUserId) return;
        try {
            setLoading(true);
            console.log("Fetching friend status for:", currentUser.id, selectedUserId);

            const response = await axios.get(`http://localhost:8080/api/friends/status`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                params: {
                    userId: currentUser.id,
                    selectedUserId: selectedUserId
                }
            });

            console.log("Fetched friend status response:", response.data);

            // 서버에서 받은 데이터로 상태 설정
            setFriendshipStatus(response.data.status);
            setIsRequester(response.data.isRequester);
        } catch (error) {
            console.error("친구 상태 확인 중 에러 발생:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriendStatus();
    }, [currentUser, selectedUserId]);

    const handleFriendRequest = async () => {
        if (!currentUser?.id || !selectedUserId) return;
        try {
            const response = await axios.post(`http://localhost:8080/api/friends/request`, null, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                params: {
                    requesterId: currentUser.id,
                    responderId: selectedUserId
                }
            });
            setFriendshipStatus("PENDING");
            alert(response.data);
        } catch (error) {
            console.error('친구 요청 중 오류 발생:', error);
        }
    };

    const handleRejectFriendRequest = async () => {
        try {
            await axios.post(`http://localhost:8080/api/friends/reject`, null, {
                params: { requestId: selectedUserId },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFriendshipStatus(null);
            alert("친구 요청이 거절되었습니다.");
            fetchFriendStatus(); // 상태 재확인
        } catch (error) {
            console.error('친구 요청 거절 중 오류 발생:', error);
        }
    };

    const handleAcceptFriendRequest = async () => {
        try {
            await axios.post(`http://localhost:8080/api/friends/accept`, null, {
                params: { requestId: selectedUserId },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFriendshipStatus("ACCEPTED");
            alert("친구 요청을 승인했습니다.");
            fetchFriendStatus(); // 상태 재확인
        } catch (error) {
            console.error('친구 요청 승인 중 오류 발생:', error);
        }
    };

    if (loading) return <p>로딩 중...</p>;

    return (
        <div className="friend-actions">
            {friendshipStatus === 'PENDING' && isRequester && (
                <div>
                    <p>친구 요청 상태: 대기중</p>
                    <button onClick={handleRejectFriendRequest}>요청 취소</button>
                </div>
            )}
            {friendshipStatus === 'PENDING' && !isRequester && (
                <div>
                    <p>친구 요청을 받았습니다.</p>
                    <button onClick={handleAcceptFriendRequest}>승인</button>
                    <button onClick={handleRejectFriendRequest}>거절</button>
                </div>
            )}
            {friendshipStatus === 'ACCEPTED' && (
                <div>
                    <p>친구 상태: 이미 친구입니다</p>
                    <button onClick={() => setFriendshipStatus(null)}>친구 삭제</button>
                </div>
            )}
            {friendshipStatus === null && (
                <button onClick={handleFriendRequest}>친구 추가</button>
            )}
        </div>
    );
};

export default FriendRequest;
