import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserDetail from '../../pages/UserDetail';

const FriendList = ({ userId }) => {
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // 친구 목록 불러오기
    const fetchFriends = async () => {
        if (!userId) {
            console.warn("fetchFriends 실행 중단 - userId가 유효하지 않습니다.");
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            console.log("API 호출 userId:", userId);
    
            const response = await axios.get(`http://localhost:8080/api/friends/list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: { userId },
            });
    
            console.log("API 응답 데이터:", response.data);
    
            // 응답 데이터 검증 로그 추가
            response.data.forEach((friend, index) => {
                // console.log(`friend[${index}] requester:`, friend.requester);
                // console.log(`friend[${index}] responder:`, friend.responder);
            });
    
            // 필터링 로직
            const filteredFriends = response.data
                .map(friend => {
                    console.log("friend.requester.id:", friend.requester.id, "friend.responder.id:", friend.responder.id, "userId:", userId);
    
                    if (String(friend.requester.id) === String(userId)) {
                        //console.log(`친구로 선택된 responder:`, friend.responder);
                        return friend.responder;
                    } else if (String(friend.responder.id) === String(userId)) {
                        //console.log(`친구로 선택된 requester:`, friend.requester);
                        return friend.requester;
                    }
                    console.warn("유효하지 않은 friend 객체:", friend);
                    return null;
                })
                .filter(Boolean);
    
            //console.log("필터링된 친구 목록:", filteredFriends);
            setFriends(filteredFriends);
        } catch (error) {
            console.error('친구 목록을 불러오는 중 오류 발생:', error);
        }
    };
    

    useEffect(() => {
        if (userId) {
            console.log("fetchFriends 호출 - userId 초기화 완료:", userId);
            fetchFriends();
        } else {
            console.warn("userId가 아직 초기화되지 않았습니다.");
        }
    }, [userId]);

    const handleFriendClick = (friend) => {
        setSelectedFriend(friend);
        setIsDetailModalOpen(true);
    };

    // 친구 삭제 함수
    const handleRemoveFriend = async (friendId) => {
        try {
            await axios.delete('http://localhost:8080/api/friends/remove', {
                params: { requestId: friendId },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            fetchFriends(); // 친구 목록 다시 불러오기
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
                            {friend.username} ({friend.email})
                        </span>
                        <button onClick={() => handleRemoveFriend(friend.id)}>삭제</button>
                    </li>
                ))}
            </ul>
            {friends.length === 0 && <p>친구가 없습니다.</p>}

            {isDetailModalOpen && selectedFriend && (
                <div className="modal-overlay" onClick={closeDetailModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeDetailModal}>닫기</button>
                        <UserDetail 
                            type="user" 
                            item={selectedFriend} 
                            closeModal={closeDetailModal} 
                            currentUser={userId} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FriendList;
