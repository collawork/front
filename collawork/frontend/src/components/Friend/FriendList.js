import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserDetail from '../../pages/UserDetail';

const FriendList = ({ userId }) => {
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const fetchFriends = async () => {
        try {
            const token = localStorage.getItem('token');
            const userIdValue = typeof userId === 'object' && userId !== null ? userId.userId : userId;
            
            const response = await axios.get(`http://localhost:8080/api/friends/list`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: { userId: userIdValue },
            });
            setFriends(response.data);
        } catch (error) {
            console.error('친구 목록을 불러오는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        if (userId) fetchFriends();
    }, [userId]);

    const handleFriendClick = (friend) => {
        const friendInfo = friend.requester.id === userId ? friend.responder : friend.requester;
        setSelectedFriend(friendInfo);
        setIsDetailModalOpen(true);
    };

    const handleRemoveFriend = async (friendId) => {
        try {
            await axios.delete('http://localhost:8080/api/friends/remove', {
                params: { requestId: friendId },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            setFriends(friends.filter(friend => friend.id !== friendId));
        } catch (error) {
            console.error('친구 삭제 중 오류 발생:', error);
        }
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedFriend(null);
    };

    return (
        <div className="friend-list">
            <h3>친구 목록</h3>
            <ul>
                {friends.map(friend => (
                    <li key={friend.id}>
                        <span onClick={() => handleFriendClick(friend)}>
                            {friend.requester.id === userId
                                ? friend.responder.username
                                : friend.requester.username}
                        </span>
                        {/* <button onClick={() => handleRemoveFriend(friend.id)}>삭제</button> */}
                    </li>
                ))}
            </ul>
            {friends.length === 0 && <p>친구가 없습니다.</p>}

            {/* 친구 상세 정보 모달 */}
            {isDetailModalOpen && selectedFriend && (
            <div className="modal-overlay" onClick={closeDetailModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={closeDetailModal}>닫기</button>
                    <UserDetail 
                        type="user" 
                        item={selectedFriend} 
                        closeModal={closeDetailModal} 
                        currentUser={userId} // 현재 사용자의 ID
                    />
                </div>
            </div>
        )}

        </div>
    );
};

export default FriendList;
