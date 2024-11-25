import React, { useEffect, useState } from "react";
import axios from "axios";
import NoticeDetailModal from "./NoticeDetail";
import NoticeCreateModal from "./CreateNotice";
import { useUser } from "../../../context/UserContext";
import "../../../components/assest/css/NoticeList.css";

const NoticeList = ({ projectId }) => {
  const [notices, setNotices] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { userId } = useUser();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchNotices();
    fetchUserRole();
  }, [projectId]);

  const fetchNotices = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("토큰이 없습니다.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/projects/${projectId}/notices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(response.data);
    } catch (error) {
      console.error("공지사항 목록 조회 실패:", error);
    }
  };

  const fetchUserRole = async () => {
    if (!projectId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("토큰이 없습니다.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/user/projects/${projectId}/role`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId },
      });
      setUserRole(response.data.role);
    } catch (error) {
      console.error("사용자 역할을 가져오는 중 오류 발생:", error);
      setUserRole(null);
    }
  };

  const openDetailModal = (noticeId) => {
    setSelectedNotice(noticeId);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedNotice(null);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleNoticeCreated = (newNotice) => {
    setNotices((prevNotices) => [newNotice, ...prevNotices]);
    closeCreateModal();
  };

  const handleNoticeUpdated = () => {
    fetchNotices();
    closeDetailModal();
  };

  return (
    <div className="notice-list-container">
      <h1>공지사항</h1>
      {userRole === "ADMIN" && (
        <button className="create-notice-button" onClick={openCreateModal}>
          공지사항 작성
        </button>
      )}
      <table className="notice-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>중요</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice, index) => (
            <tr key={notice.id} onClick={() => openDetailModal(notice.id)}>
              <td>{index + 1}</td>
              <td>{notice.important ? "중요" : ""}</td>
              <td>{notice.title}</td>
              <td>{notice.creatorName || "알 수 없음"}</td>
              <td>{new Date(notice.createdAt).toLocaleString()}</td>
              <td>{notice.viewCount || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isDetailModalOpen && selectedNotice && (
        <NoticeDetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          projectId={projectId}
          noticeId={selectedNotice}
          onNoticeUpdated={handleNoticeUpdated}
        />
      )}
      {isCreateModalOpen && (
        <NoticeCreateModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          projectId={projectId}
          onNoticeCreated={handleNoticeCreated}
        />
      )}
    </div>
  );
};

export default NoticeList;
