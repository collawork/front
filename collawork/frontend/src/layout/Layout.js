import { Outlet } from "react-router-dom";
import { useState, useEffect } from 'react';
import TopHeader from "../components/TopHeader";
import Aside from "../components/Aside";
import "../components/assest/css/Layout.css"; 
import axios from 'axios';

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], projects: [], chatRooms: [] });
  const [noResults, setNoResults] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setIsModalOpen(true); // 검색모당
    } catch (error) {
      console.error('검색 중 오류 발생: ', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="layout-container">
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="사용자, 프로젝트, 채팅방 검색..."
          className="search-input"
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
                      <li key={user.id}>{user.username} <span className="result-type">(사용자)</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {searchResults.projects.length > 0 && (
                <div className="search-section">
                  <h3>프로젝트 검색 결과</h3>
                  <ul>
                    {searchResults.projects.map((project) => (
                      <li key={project.id}>{project.projectName} <span className="result-type">(프로젝트)</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {searchResults.chatRooms.length > 0 && (
                <div className="search-section">
                  <h3>채팅방 검색 결과</h3>
                  <ul>
                    {searchResults.chatRooms.map((chatRoom) => (
                      <li key={chatRoom.id}>{chatRoom.roomName} <span className="result-type">(채팅방)</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="main-content">
        <Aside />
        <div className="outlet-content">
          <Outlet />
        </div>
        
        <div className="participants">
          <div>참여자 목록 / 친구 목록</div>
          <div className="friend-list-modal">
            <ul>
              <li>a</li>
              <li>b</li>
              <li>c</li>
              <li>d</li>
              <li>e</li>
            </ul>
          </div>
          <div>Pagination or other content here</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
