import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserDetail from '../../pages/UserDetail';

const FriendList = ({ userId }) => {
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const fetchFriends = async () => {
        try {
            const token = localStorage.getItem('token');
            const userIdValue = typeof userId === 'object' && userId !== null ? userId.userId : userId;
            
            console.log("친구 리스트 token:", token);
            console.log("전달되는 userId 값:", userIdValue);
    
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

    const openFriendDetail = (friend) => {
        setSelectedFriend(friend);
    };

    const closeFriendDetail = () => {
        setSelectedFriend(null);
    };

    return (
        <div className="friend-list">
            <h3>친구 목록</h3>
            <ul>
                {friends.map(friend => (
                    <li key={friend.id}>
                        <button onClick={() => openFriendDetail(friend)}>
                            {friend.requester.id === userId ? friend.responder.username : friend.requester.username}
                        </button>
                        <button onClick={() => handleRemoveFriend(friend.id)}>삭제</button>
                    </li>
                ))}
            </ul>
            {friends.length === 0 && <p>친구가 없습니다.</p>}

            {/* 선택한 친구 정보 모달 */}
            {selectedFriend && (
                <UserDetail
                    type="user"
                    item={selectedFriend}
                    closeModal={closeFriendDetail}
                    currentUser={userId}
                />
            )}
        </div>
    );
};

export default FriendList;
