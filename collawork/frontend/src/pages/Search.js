import { useState, useEffect } from 'react';
import axios from 'axios';
import UserDetail from './UserDetail';
import "../components/assest/css/Search.css";

const Search = ({ currentUser}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], projects: [], chatRooms: [] });
  const [noResults, setNoResults] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/search', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { query: searchQuery },
        });

        console.log("API 응답 데이터:", response.data);
        console.log("현재 로그인된 사용자:", currentUser);

        // 응답 데이터 검증 및 기본값 설정
        const users = Array.isArray(response.data.users) ? response.data.users : [];
        const projects = Array.isArray(response.data.projects) ? response.data.projects : [];

        // 로그인된 사용자 제외 및 필터링
        const filteredResults = {
            users: users.filter(user =>
                (user.username.includes(searchQuery) || user.email.includes(searchQuery)) &&
                Number(currentUser.id) !== Number(user.id) // 타입 변환 후 비교
            ),
            projects: projects.filter(project =>
                project.projectName.includes(searchQuery)
            ),
            chatRooms: [],
        };

        // 결과 확인
        const isEmptyResults = 
            filteredResults.users.length === 0 &&
            filteredResults.projects.length === 0 &&
            filteredResults.chatRooms.length === 0;

        setNoResults(isEmptyResults);
        setSearchResults(filteredResults);
        setIsModalOpen(true);
    } catch (error) {
        console.error('검색 중 오류 발생: ', error);
        setNoResults(true);
    }
};



  const handleResultClick = (type, item) => {
    setSelectedDetail({ type, item });
    setIsDetailModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDetail(null);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDetail(null);
  };

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="사용자, 프로젝트, 채팅방 검색..."
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      {/* 검색 결과 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button-search" onClick={closeModal}>닫기</button>
            {noResults && <div className="no-results">검색 결과가 없습니다.</div>}
            <div className="search-results">
              {searchResults.users.length > 0 && (
                <div className="search-section">
                  <h3>사용자 검색 결과</h3>
                  <ul>
                    {searchResults.users.map((user) => (
                      <li key={user.id} onClick={() => handleResultClick('user', user)}>
                        <span>{user.username}</span> - <span>{user.email}</span>
                        <span className="result-type">사용자</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {searchResults.projects.length > 0 && (
                <div className="search-section">
                  <h3>프로젝트 검색 결과</h3>
                  <ul>
                    {searchResults.projects.map((project) => (
                      <li key={project.id} onClick={() => handleResultClick('project', project)}>
                        {project.projectName}
                        <span className="result-type">프로젝트</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {searchResults.chatRooms.length > 0 && (
                <div className="search-section">
                  <h3>채팅방 검색 결과</h3>
                  <ul>
                    {searchResults.chatRooms.map((chatRoom) => (
                      <li key={chatRoom.id} onClick={() => handleResultClick('chatRoom', chatRoom)}>
                        {chatRoom.roomName}
                        <span className="result-type">채팅방</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 상세 정보 모달 */}
      {isDetailModalOpen && selectedDetail && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button-search" onClick={closeDetailModal}>닫기</button>
            <UserDetail type={selectedDetail.type} item={selectedDetail.item} closeModal={closeDetailModal} currentUser={currentUser} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
