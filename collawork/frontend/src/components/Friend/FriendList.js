import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FriendList = ({ userId }) => {
    const [friends, setFriends] = useState([]);

    const fetchFriends = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/friends/list', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { userId }
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

    return (
        <div className="friend-list">
            <h3>친구 목록</h3>
            <ul>
                {friends.map(friend => (
                    <li key={friend.id}>
                        {friend.requester.id === userId
                            ? friend.responder.username
                            : friend.requester.username}
                        <button onClick={() => handleRemoveFriend(friend.id)}>삭제</button>
                    </li>
                ))}
            </ul>
            {friends.length === 0 && <p>친구가 없습니다.</p>}
        </div>
    );
};

export default FriendList;
