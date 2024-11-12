import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendRequest = ({ currentUser, selectedUserId, fetchFriends }) => {
    const [friendshipStatus, setFriendshipStatus] = useState(null);
    const [isRequester, setIsRequester] = useState(false);
    const [loading, setLoading] = useState(true);
    const [requesterIdFromFriend, setRequesterIdFromFriend] = useState(null);

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

                console.log("백엔드에서 가져온 응답:", response.data);
                const { status, isRequester: requesterStatus, requesterId } = response.data;

                setFriendshipStatus(status);
                setIsRequester(requesterStatus);
                setRequesterIdFromFriend(requesterId);
            } catch (error) {
                console.error("친구 상태 확인 중 에러 발생:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriendStatus();
    }, [currentUser, selectedUserId]);


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
            setIsRequester(true); // 요청자임을 표시
            alert(response.data.message);
        } catch (error) {
            console.error('친구 요청 중 오류 발생:', error);
        }
    };
    

    const handleAcceptFriendRequest = async () => {
        try {
            console.log("승인할 친구 요청 requesterId:", requesterIdFromFriend);
            console.log("현재 사용자 responderId:", currentUser.id);

            const response = await axios.post(`http://localhost:8080/api/friends/accept`, null, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                params: {
                    requesterId: requesterIdFromFriend,  // 친구 요청을 보낸 사용자 ID
                    responderId: currentUser.id          // 현재 로그인된 사용자 ID
                }
            });

            console.log("친구 요청 승인 응답:", response.data);

            setFriendshipStatus("ACCEPTED");
            alert("친구 요청을 승인했습니다.");

            if (fetchFriends) {
                fetchFriends();
            }
        } catch (error) {
            console.error('친구 요청 수락 중 오류 발생:', error);
        }
    };


    const handleRejectFriendRequest = async () => {
        try {
            await axios.post(`http://localhost:8080/api/friends/reject`, null, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                params: {
                    requesterId: currentUser.id,          // 요청자 ID 설정
                    responderId: selectedUserId           // 응답자 ID 설정
                }
            });

            
            // 친구 관계 상태를 초기화하여 '친구 추가' 버튼이 다시 나타나도록 설정
            setFriendshipStatus('NONE');
            alert("친구 요청을 취소했습니다.");
        } catch (error) {
            console.error('친구 요청 거절 중 오류 발생:', error);
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
                    <button onClick={() => setFriendshipStatus('NONE')}>친구 삭제</button>
                </div>
            )}
            {/* 친구 관계 상태가 NONE일 때 친구 추가 버튼 표시 */}
            {friendshipStatus === 'NONE' && (
            <button onClick={() => handleFriendRequest(currentUser.id, selectedUserId)}>
                친구 추가
            </button>
        )}
        </div>
    );

}

export default FriendRequest;
