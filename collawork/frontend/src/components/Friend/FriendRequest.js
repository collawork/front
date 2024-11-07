import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendRequest = ({ currentUser, selectedUserId, fetchFriends }) => {
    const [friendshipStatus, setFriendshipStatus] = useState(null);
    const [isRequester, setIsRequester] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFriendStatus = async () => {
            if (!currentUser?.id || !selectedUserId) return;

            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/api/friends/status`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    params: {
                        userId: currentUser.id,
                        selectedUserId: selectedUserId
                    }
                });

                const { status, isRequester } = response.data;
                setFriendshipStatus(status !== "NONE" ? status : null);
                setIsRequester(isRequester);
            } catch (error) {
                console.error("친구 상태 확인 중 에러 발생:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriendStatus();
    }, [currentUser, selectedUserId]);

    const handleFriendRequest = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/api/friends/request`, null, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                params: {
                    requesterId: currentUser.id,
                    responderId: selectedUserId
                }
            });
            setFriendshipStatus("PENDING");
            alert(response.data.message);
        } catch (error) {
            console.error('친구 요청 중 오류 발생:', error);
        }
    };    

    if (loading) return <p>로딩 중...</p>;

    return (
        <div className="friend-actions">
            {friendshipStatus === 'PENDING' && isRequester && (
                <div>
                    <p>친구 요청 상태: 대기중</p>
                    <button onClick={() => setFriendshipStatus(null)}>요청 취소</button>
                </div>
            )}
            {friendshipStatus === 'PENDING' && !isRequester && (
                <div>
                    <p>친구 요청을 받았습니다.</p>
                    <button onClick={() => setFriendshipStatus("ACCEPTED")}>승인</button>
                    <button onClick={() => setFriendshipStatus(null)}>거절</button>
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
