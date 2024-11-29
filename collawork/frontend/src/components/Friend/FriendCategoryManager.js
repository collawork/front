import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../components/assest/css/FriendCategoryManager.css";
import UserDetail from "../../pages/UserDetail";
import Pagination from "../Pagination";

const FriendCategoryManager = ({ userId, onClose }) => {
    const [categories, setCategories] = useState([]);
    const [friends, setFriends] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [searchText, setSearchText] = useState("");
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [selectedCategoryFriends, setSelectedCategoryFriends] = useState([]);
    const [addToCategory, setAddToCategory] = useState([]);
    const modalRef = useRef(null);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [showUserDetail, setShowUserDetail] = useState(false);   
    const [currentPage, setCurrentPage] = useState(1);
    const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
    const pageSize = 5;
    const paginatedFriends = Pagination(filteredFriends, currentPage);
    const paginatedCategoryFriends = Pagination(selectedCategoryFriends, currentCategoryPage);



    const API_URL = process.env.REACT_APP_API_URL;

    // 초기 로딩
    useEffect(() => {
        fetchCategories();
        fetchFriends();
    }, []);

    // 카테고리 선택 시 친구 목록 로드
    useEffect(() => {
        if (selectedCategory) {
            fetchCategoryFriends(selectedCategory.id);
        }
    }, [selectedCategory]);

    // 검색어 변경 시 친구 목록 필터링
    useEffect(() => {
        const filtered = friends.filter((friend) => {
            if (!friend || typeof friend !== "object") return false;

            const username = friend.username || "";
            const email = friend.email || "";

            return (
                username.toLowerCase().includes(searchText.toLowerCase()) ||
                email.toLowerCase().includes(searchText.toLowerCase())
            );
        });
        setFilteredFriends(filtered);
    }, [searchText, friends]);

    // 모달 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/category/categories/list`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const transformedCategories = Array.isArray(response.data)
                ? response.data.map((category) => ({
                      id: category.id,
                      name: category.name,
                  }))
                : [];
            setCategories(transformedCategories);
        } catch (error) {
            console.error("카테고리 목록 불러오기 실패:", error);
            setCategories([]);
        }
    };

    const fetchFriends = async () => {
        if (!userId) return;
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/friends/list`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { userId },
            });
            const friendList = response.data.map((relation) =>
                relation.requester.id === userId ? relation.responder : relation.requester
            );
            const uniqueFriends = friendList.filter(
                (friend, index, self) =>
                    self.findIndex((f) => f.id === friend.id) === index
            );
            setFriends(uniqueFriends);
        } catch (error) {
            console.error("친구 목록 불러오기 실패:", error);
        }
    };

    const fetchCategoryFriends = async (categoryId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/category/categories/${categoryId}/friends`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const categoryFriends = response.data.filter(
                (friend, index, self) =>
                    self.findIndex((f) => f.id === friend.id) === index
            );
            setSelectedCategoryFriends(categoryFriends);

            // 친구 목록에서 카테고리에 포함되지 않은 사용자만 필터링
            const updatedFriends = friends.filter(
                (friend) => !categoryFriends.some((catFriend) => catFriend.id === friend.id)
            );
            setFriends(updatedFriends);
        } catch (error) {
            console.error("카테고리 친구 목록 불러오기 실패:", error);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName) return;
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${API_URL}/api/category/categories/create`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { name: newCategoryName },
                }
            );
            setNewCategoryName("");
            fetchCategories();
        } catch (error) {
            console.error("카테고리 생성 실패:", error);
        }
    };

    const handleAddFriendsToCategory = async () => {
        if (!selectedCategory || selectedFriends.length === 0) {
            alert("카테고리 또는 친구를 선택해주세요.");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${API_URL}/api/category/categories/${selectedCategory.id}/add-friends`,
                selectedFriends,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCategoryFriends(selectedCategory.id);
            setSelectedFriends([]);
        } catch (error) {
            console.error("친구 추가 실패:", error);
            alert("친구 추가 중 문제가 발생했습니다.");
        }
    };

    const handleRemoveFromCategory = async () => {
        if (!selectedCategory) {
            alert("카테고리가 선택되지 않았습니다.");
            return;
        }
    
        if (addToCategory.length === 0) {
            alert("제외할 친구를 선택해주세요.");
            return;
        }
    
        try {
            const token = localStorage.getItem("token");
    
            await axios.post(
                `${API_URL}/api/category/categories/${selectedCategory.id}/remove-friends`,
                addToCategory,
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            const removedFriends = selectedCategoryFriends.filter((friend) =>
                addToCategory.includes(friend.id)
            );
    
            setFriends((prev) => [...prev, ...removedFriends]);
            setSelectedCategoryFriends((prev) =>
                prev.filter((friend) => !addToCategory.includes(friend.id))
            );
            setAddToCategory([]);
        } catch (error) {
            console.error("친구 제외 실패:", error);
            alert("친구 제외 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm("정말 이 카테고리를 삭제하시겠습니까?")) return;
    
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/api/category/categories/${categoryId}/delete`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            setCategories((prev) => prev.filter((category) => category.id !== categoryId));
            if (selectedCategory?.id === categoryId) {
                setSelectedCategory(null);
                setSelectedCategoryFriends([]);
            }
            fetchCategories();
            fetchFriends();
        } catch (error) {
            console.error("카테고리 삭제 실패:", error);
            alert("카테고리 삭제 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
    };
        
    const handleFriendSelection = (friendId) => {
        setSelectedFriends((prev) =>
            prev.includes(friendId)
                ? prev.filter((id) => id !== friendId)
                : [...prev, friendId]
        );
    };

    const handleSelectAllFriends = () => {
        setSelectedFriends(
            selectedFriends.length === filteredFriends.length
                ? []
                : filteredFriends.map((friend) => friend.id)
        );
    };

    const handleCategoryFriendSelection = (friendId) => {
        setAddToCategory((prev) =>
            prev.includes(friendId)
                ? prev.filter((id) => id !== friendId)
                : [...prev, friendId]
        );
    };

    const handleFriendClick = (friend) => {
        setSelectedFriend(friend);
        setShowUserDetail(true);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredFriends]);

    return (
        <div className="modal-overlay-friendcate">
            <div className="friend-cate-modal-content" ref={modalRef}>
                <div className="friend-category-manager">
                    {/* 좌측 카테고리 목록 */}
                    <div className="sidebar">
                        <h3>카테고리</h3>
                        <button onClick={handleCreateCategory}>+ 카테고리 생성</button>
                        {selectedCategory && (
                            <button
                                onClick={() => handleDeleteCategory(selectedCategory.id)}
                                className="delete-category-button"
                            >
                                삭제
                            </button>
                        )}
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="카테고리 이름"
                            className="input-category-name"
                        />
                        <ul>
                            {categories
                                .slice((currentCategoryPage - 1) * pageSize, currentCategoryPage * pageSize)
                                .map((category) => (
                                    <li
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category)}
                                        className={selectedCategory?.id === category.id ? "active" : ""}
                                    >
                                        {category.name}
                                    </li>
                                ))}
                        </ul>
                        <div className="pagination">
                            <button
                                disabled={currentCategoryPage === 1}
                                onClick={() => setCurrentCategoryPage((prev) => prev - 1)}
                            >
                                이전
                            </button>
                            <span>{currentCategoryPage}</span>
                            <button
                                disabled={currentCategoryPage === Math.ceil(categories.length / pageSize)}
                                onClick={() => setCurrentCategoryPage((prev) => prev + 1)}
                            >
                                다음
                            </button>
                        </div>
                    </div>
    
                    {/* 중간 추가하기 영역 */}
                    {selectedCategory && (
                        <div className="add-friends-to-category">
                            <h3>{selectedCategory.name} 에 추가하기</h3>
                            <div>
                                <input
                                    type="checkbox"
                                    checked={addToCategory.length === selectedCategoryFriends.length}
                                    onChange={() =>
                                        setAddToCategory(
                                            addToCategory.length === selectedCategoryFriends.length
                                                ? []
                                                : selectedCategoryFriends.map((friend) => friend.id)
                                        )
                                    }
                                />
                                <label>전체 선택</label>
                                <button onClick={handleRemoveFromCategory} className="sidebar-button">제외하기</button>
                            </div>
                            <ul>
                                {selectedCategoryFriends.map((friend) => (
                                    <li key={friend.id}>
                                        <input
                                            type="checkbox"
                                            checked={addToCategory.includes(friend.id)}
                                            onChange={() => handleCategoryFriendSelection(friend.id)}
                                        />
                                        <span>{friend.username} ({friend.email})</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
    
                    {/* 우측 친구 목록 */}
                    <div className="content">
                        <h3>친구 목록</h3>
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="친구 검색"
                            className="input-category-name"
                        />
                        <div>
                            <input
                                type="checkbox"
                                checked={selectedFriends.length === filteredFriends.length}
                                onChange={handleSelectAllFriends}
                            />
                            <label>전체 선택</label>
                            <button onClick={handleAddFriendsToCategory} className="sidebar-button">추가하기</button>
                        </div>
                        <ul>
                            {filteredFriends
                                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                                .map((friend) => (
                                    <li key={friend.id}>
                                        <input
                                            type="checkbox"
                                            checked={selectedFriends.includes(friend.id)}
                                            onChange={() => handleFriendSelection(friend.id)}
                                        />
                                        <span onClick={() => handleFriendClick(friend)}>
                                            {friend.username} ({friend.email})
                                        </span>
                                    </li>
                                ))}
                        </ul>
                        <div className="pagination">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                            >
                                이전
                            </button>
                            <span>{currentPage}</span>
                            <button
                                disabled={currentPage === Math.ceil(filteredFriends.length / pageSize)}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                            >
                                다음
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* UserDetail 모달 */}
            {showUserDetail && selectedFriend && (
                <div className="user-detail-modal-right">
                    <div className="user-detail-modal2">
                        <UserDetail
                            type="user"
                            item={selectedFriend}
                            closeModal={() => setShowUserDetail(false)}
                            currentUser={userId}
                        />
                    </div>
                </div>
            )}
        </div>
    );
    
};

export default FriendCategoryManager;
