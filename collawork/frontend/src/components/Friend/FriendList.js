import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserDetail from '../../pages/UserDetail';
import FriendCategoryManager from './FriendCategoryManager';
import Pagination from '../Pagination'; // 기존 Pagination 컴포넌트 사용
import '../../components/assest/css/FriendList.css'
import Recycle from '../../components/assest/images/recycle-bin.png';

const FriendList = ({ userId }) => {
    const [friends, setFriends] = useState([]); // 전체 친구 목록
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [pageSize] = useState(5); // 한 페이지당 표시할 친구 수
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [showCategoryManager, setShowCategoryManager] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;

    // 친구 목록 불러오기
    const fetchFriends = async () => {
        if (!userId) {
            console.warn("fetchFriends 실행 중단 - userId가 유효하지 않습니다.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            console.log("API 호출 userId:", userId);

            const response = await axios.get(`${API_URL}/api/friends/list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: { userId },
            });

            console.log("API 응답 데이터:", response.data);

            // 필터링 로직
            const filteredFriends = response.data
                .map(friend => {
                    if (String(friend.requester.id) === String(userId)) {
                        return friend.responder;
                    } else if (String(friend.responder.id) === String(userId)) {
                        return friend.requester;
                    }
                    console.warn("유효하지 않은 friend 객체:", friend);
                    return null;
                })
                .filter(Boolean);

            console.log("필터링된 친구 목록:", filteredFriends);
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

    // 친구 삭제 함수
    const handleRemoveFriend = async (friendId) => {
        try {
            await axios.delete(`${API_URL}/api/friends/remove`, {
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

    const handleFriendClick = (friend) => {
        setSelectedFriend(friend);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedFriend(null);
    };

    // 현재 페이지에 표시할 친구 목록 계산
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedFriends = friends.slice(startIndex, endIndex);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(friends.length / pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="friend-list">
            <div className="friend-list-header">
                <span>친구 목록</span>
                <button onClick={() => setShowCategoryManager(true)} className="open-friendship-List">
                    목록 열기
                </button>
            </div>
            {showCategoryManager && (
                <FriendCategoryManager
                    userId={userId}
                    onClose={() => setShowCategoryManager(false)}
                />
            )}
            <ul>
                {paginatedFriends.map(friend => (
                    <li key={friend.id}>
                        <span onClick={() => handleFriendClick(friend)}>
                            {friend.username} ({friend.email})
                        </span>
                        
                        <button onClick={() => handleRemoveFriend(friend.id)} className="friend-delete-btn">
                            <img src={Recycle} alt="Recycle icon" />
                        </button>
                    </li>
                ))}
            </ul>
            {friends.length === 0 && <p>친구가 없습니다.</p>}

            {/* Pagination Component */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

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
