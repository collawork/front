import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendRequest = ({ currentUser, selectedUserId, fetchFriends }) => {
    const [friendshipStatus, setFriendshipStatus] = useState(null);
    const [isRequester, setIsRequester] = useState(false);
    const [loading, setLoading] = useState(true);
    const [requesterIdFromFriend, setRequesterIdFromFriend] = useState(null);
    const [friendshipId, setFriendshipId] = useState(null);

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

                console.log("친구 상태 응답 데이터:", response.data);
                const { status, isRequester: requesterStatus, id: friendshipId } = response.data;
                setFriendshipStatus(status);
                setIsRequester(requesterStatus);
                setFriendshipId(friendshipId);
            } catch (error) {
                console.error("친구 상태 확인 중 에러 발생:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriendStatus();
    }, [currentUser, selectedUserId]);


    // 친구 요청 기능
    const handleFriendRequest = async (requesterId, responderId) => {
        try {
            const response = await axios.post(
                `http://localhost:8080/api/friends/request`,
                { requesterId, responderId },
                {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                }
            );
            
            setFriendshipStatus("PENDING");
            setIsRequester(true); // 요청자임을 표시하는 것
            alert(response.data.message);
        } catch (error) {
            console.error('친구 요청 중 오류 발생:', error);
        }
    };
    

    // 친구 승인 기능
    const handleAcceptFriendRequest = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("인증 토큰이 없습니다. 로그인 후 다시 시도하세요.");
            }
    
            console.log("친구 요청 승인 요청 - requestId:", friendshipId);
    
            const response = await axios.post(
                `http://localhost:8080/api/friends/accept`,
                null,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        requestId: friendshipId,
                        responderId: currentUser.id
                    }
                }
            );
    
            alert("친구 요청을 승인했습니다.");
            if (fetchFriends) fetchFriends();
        } catch (error) {
            console.error('친구 요청 수락 중 오류 발생:', error);
            alert('친구 요청을 수락하는 중 오류가 발생했습니다.');
        }
    };



    // 친구 거절 기능
    const handleRejectFriendRequest = async () => {
        try {
            await axios.post(`http://localhost:8080/api/friends/reject`, null, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                params: {
                    requesterId: currentUser.id,
                    responderId: selectedUserId
                }
            });

            setFriendshipStatus('NONE');
            alert("친구 요청을 취소했습니다.");
        } catch (error) {
            console.error('친구 요청 거절 중 오류 발생:', error);
        }
    };

    // 친구 삭제 기능
    const handleRemoveFriend = async () => {
        try {
            // 삭제할 친구의 requestId가 설정되었는지 확인
            if (!requesterIdFromFriend) {
                console.error('삭제할 친구의 requestId가 설정되지 않았습니다.');
                return;
            }

            const response = await axios.delete('http://localhost:8080/api/friends/remove', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                params: { requestId: requesterIdFromFriend }
            });

            setFriendshipStatus('NONE');
            alert(response.data);
        } catch (error) {
            console.error('친구 삭제 중 오류 발생:', error);
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
                    <button onClick={() => handleAcceptFriendRequest(requesterIdFromFriend, currentUser.id)}>
                        승인
                    </button>
                    <button onClick={handleRejectFriendRequest}>거절</button>
                </div>
            )}
            {friendshipStatus === 'ACCEPTED' && (
                <div>
                    <p>친구 상태: 이미 친구입니다</p>
                    <button onClick={handleRemoveFriend}>친구 삭제</button>
                </div>
            )}
            {friendshipStatus === 'NONE' && (
                <button onClick={() => handleFriendRequest(currentUser.id, selectedUserId)}>
                    친구 추가
                </button>
            )}
        </div>
    );
};

export default FriendRequest;
