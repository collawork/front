import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const FriendRequest = ({ selectedUserId, fetchFriends }) => {
    const [friendshipStatus, setFriendshipStatus] = useState(null);
    const [isRequester, setIsRequester] = useState(false);
    const [loading, setLoading] = useState(true);
    const [friendshipId, setFriendshipId] = useState(null);
    const { userId } = useUser();

    useEffect(() => {
        const fetchFriendStatus = async () => {
            if (!userId|| !selectedUserId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/api/friends/status`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    params: {
                        userId: userId,
                        selectedUserId: selectedUserId
                    }
                });

                const { status, isRequester: requesterStatus, id } = response.data;
                setFriendshipStatus(status);
                setIsRequester(requesterStatus);
                setFriendshipId(id);
            } catch (error) {
                console.error("친구 상태 확인 중 에러 발생:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriendStatus();
    }, [userId, selectedUserId]);

    // 친구 요청 기능
    const handleFriendRequest = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8080/api/friends/request`,
                { requesterId: userId, responderId: selectedUserId },
                { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
            );
            
            setFriendshipStatus("PENDING");
            setIsRequester(true);
            alert(response.data.message);
        } catch (error) {
            console.error('친구 요청 중 오류 발생:', error);
        }
    };

    // 친구 승인 기능
    const handleAcceptFriendRequest = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("인증 토큰이 없습니다. 로그인 후 다시 시도하세요.");

            const response = await axios.post(
                `http://localhost:8080/api/friends/accept`,
                null,
                {
                    headers: { 'Authorization': `Bearer ${token}` },
                    params: { requestId: friendshipId, responderId: userId }
                }
            );

            setFriendshipStatus("ACCEPTED");
            if (fetchFriends) fetchFriends();
            alert("친구 요청을 승인했습니다.");
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
                params: { requesterId: userId, responderId: selectedUserId }
            });

            setFriendshipStatus('NONE');
            alert("친구 요청을 거절했습니다.");
        } catch (error) {
            console.error('친구 요청 거절 중 오류 발생:', error);
        }
    };

    // 친구 삭제 기능
    const handleRemoveFriend = async () => {
        if (!friendshipId) {
            console.error('삭제할 친구의 requestId가 설정되지 않았습니다.');
            return;
        }

        try {
            await axios.delete('http://localhost:8080/api/friends/remove', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                params: { requestId: friendshipId }
            });

            setFriendshipStatus('NONE');
            alert("친구가 삭제되었습니다.");
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
                    <button onClick={handleAcceptFriendRequest}>승인</button>
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
                <button onClick={handleFriendRequest}>친구 추가</button>
            )}
        </div>
    );
};

export default FriendRequest;
