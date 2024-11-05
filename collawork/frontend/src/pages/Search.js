import { useState } from 'react';
import axios from 'axios';
import UserDetail from './UserDetail';
import "../components/assest/css/Search.css";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], projects: [], chatRooms: [] });
  const [noResults, setNoResults] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/search', {
        params: { query: searchQuery },
      });
      if (response.data.users.length === 0 && response.data.projects.length === 0 && response.data.chatRooms.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
      setSearchResults(response.data);
      setIsModalOpen(true); // 검색 후 모달 열기
    } catch (error) {
      console.error('검색 중 오류 발생: ', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleResultClick = (type, item) => {
    setSelectedDetail({ type, item });
  };

  const closeDetailModal = () => {
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>닫기</button>
            {noResults && <div className="no-results">검색 결과가 없습니다.</div>}
            <div className="search-results">
              {searchResults.users.length > 0 && (
                <div className="search-section">
                  <h3>사용자 검색 결과</h3>
                  <ul>
                    {searchResults.users.map((user) => (
                      <li key={user.id} onClick={() => handleResultClick('user', user)}>
                        {user.username}
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
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

        {selectedDetail && selectedDetail.type === 'user' && (
        <UserDetail
            user={selectedDetail.item}
            closeDetailModal={closeDetailModal}
        />
        )}
    </div>
  );
};

export default Search;
