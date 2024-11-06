import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/Axios';

const FriendList = ({ userId }) => {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axiosInstance.get('/friends/list', {
                    params: { userId },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                setFriends(response.data);
            } catch (error) {
                console.error('친구 목록을 불러오는 중 오류 발생:', error);
            }
        };

        if (userId) fetchFriends();
    }, [userId]);

    if (friends.length === 0) {
        return <p>친구가 없습니다.</p>;
    }

    return (
        <div className="friend-list">
            <h3>친구 목록</h3>
            <ul>
                {friends.map(friend => (
                    <li key={friend.id}>
                        {friend.requester.id === userId
                            ? friend.responder.username
                            : friend.requester.username}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FriendList;
