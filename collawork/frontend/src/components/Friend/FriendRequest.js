import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendRequest = ({ currentUser, selectedUserId }) => {
    const [friendshipStatus, setFriendshipStatus] = useState(null);

    useEffect(() => {
        if (!currentUser?.id || !selectedUserId) return;
        const checkFriendStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/friends/status`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    params: {
                        userId: currentUser.id,
                        selectedUserId: selectedUserId
                    }
                });
                setFriendshipStatus(response.data);
            } catch (error) {
                console.error("친구 상태 확인 중 에러 발생 : ", error);
            }
        };

        checkFriendStatus();
    }, [currentUser, selectedUserId]);

    const handleFriendRequest = async () => {
        console.log("친구 요청 버튼 클릭됨");
        console.log("FriendRequest currentUser : ", currentUser);
        console.log("FriendRequest selectedUserId : ", selectedUserId);
        
        if (!currentUser?.id || !selectedUserId) return;
        
        try {
            const response = await axios.post('http://localhost:8080/api/friends/request', null, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                params: {
                    requesterId: currentUser.id,
                    responderId: selectedUserId
                }
            });
            
            if (response.data === "이미 친구 요청을 보냈습니다.") {
                setFriendshipStatus("PENDING");
            } else if (response.data === "이미 친구입니다.") {
                setFriendshipStatus("ACCEPTED");
            } else {
                setFriendshipStatus("PENDING");
            }
            
            alert(response.data);
            console.log("친구 요청 응답:", response.data);
        } catch (error) {
            console.error('친구 요청 중 오류 발생: ', error);
        }
    };
    

    const handleRemoveFriend = async () => {
        if (!currentUser?.id || !selectedUserId) return;
        
        try {
            const response = await axios.delete('http://localhost:8080/api/friends/remove', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                params: { requestId: selectedUserId }
            });
            setFriendshipStatus(null);
            alert(response.data);
        } catch (error) {
            console.error('친구 삭제 중 오류 발생: ', error);
        }
    };

    return (
        <div className="friend-actions">
            {friendshipStatus === 'PENDING' && <p>친구 요청 상태: 대기중</p>}
            {friendshipStatus === 'ACCEPTED' && (
                <>
                    <p>친구 상태: 이미 친구입니다</p>
                    <button onClick={handleRemoveFriend}>친구 삭제</button>
                </>
            )}
            {friendshipStatus === 'REJECTED' && (
                <button onClick={handleFriendRequest}>
                    친구 추가
                </button>
            )}
            {friendshipStatus !== 'ACCEPTED' && friendshipStatus !== 'PENDING' && friendshipStatus !== 'REJECTED' && (
                <button onClick={handleFriendRequest}>
                    친구 추가
                </button>
            )}
        </div>
    );
};

export default FriendRequest;
