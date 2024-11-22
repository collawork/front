import React, { useEffect, useState } from "react";
import axios from "axios";
import NoticeDetailModal from "./NoticeDetail";
import NoticeCreateModal from "./CreateNotice";
import { useUser } from "../../../context/UserContext";
import '../../../components/assest/css/NoticeList.css';

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

  return (
    <div>
      <h1>공지사항 목록</h1>
      {userRole === "ADMIN" && (
        <button onClick={openCreateModal}>공지사항 작성</button>
      )}
      <ul>
        {notices.map((notice) => (
          <li key={notice.id} onClick={() => openDetailModal(notice.id)}>
            <strong>{notice.important ? "[중요] " : ""}</strong>
            {notice.title}
          </li>
        ))}
      </ul>
      {isDetailModalOpen && selectedNotice && (
        <NoticeDetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          projectId={projectId}
          noticeId={selectedNotice}
        />
      )}
      {isCreateModalOpen && (
        <NoticeCreateModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          projectId={projectId}
          onNoticeCreated={fetchNotices} 
        />
      )}
    </div>
  );
};

export default NoticeList;
