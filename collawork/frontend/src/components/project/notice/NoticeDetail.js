import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../context/UserContext";
import "../../../components/assest/css/NoticeDetail.css";

const NoticeDetail = ({ projectId, noticeId, isOpen, onClose }) => {
  const [notice, setNotice] = useState(null);
  const [userRole, setUserRole] = useState("");
  const { userId } = useUser();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (isOpen) {
      fetchNotice();
      fetchUserRole();
    }
  }, [isOpen, noticeId]);

  const fetchNotice = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("토큰이 없습니다.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/projects/${projectId}/notices/${noticeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotice(response.data);
    } catch (error) {
      console.error("공지사항 조회 실패:", error);
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

  const deleteNotice = async () => {
    try {
      await axios.delete(`${API_URL}/api/projects/${projectId}/notices/${noticeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("공지사항이 삭제되었습니다.");
      onClose(); // 모달 닫기
    } catch (error) {
      console.error("공지사항 삭제 실패:", error);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose(); // 외부 클릭 시 닫기
    }
  };

  if (!isOpen || !notice) return null;

  console.log("notice : ", notice);

  return (
    <div className="notice-modal-overlay" onClick={handleOverlayClick}>
      <div className="notice-modal-content">
        <h1 className="notice-modal-title">{notice.title}</h1>
        <p className="notice-modal-content-text">{notice.content}</p>
        <p className="notice-modal-important">{notice.important ? "[중요 공지]" : ""}</p>
        <p className="notice-modal-creator">작성자: {notice.creatorId}</p>
        {/* 첨부파일 리스트 */}
        {notice.attachments && notice.attachments.length > 0 && (
        <div className="attachments">
            <h3>첨부파일:</h3>
            <ul>
            {notice.attachments.map((file, index) => (
                <li key={index}>
                <a
                    href={`${API_URL}${file.fileUrl}`} // 정확한 다운로드 경로
                    download // 다운로드 속성 추가
                >
                    {file.fileName}
                </a>
                </li>
            ))}
            </ul>
        </div>
        )}
        {userRole === "ADMIN" && (
          <div className="notice-modal-actions">
            <button
              className="notice-modal-delete-button"
              onClick={deleteNotice}
            >
              삭제
            </button>
            <button
              className="notice-modal-close-button"
              onClick={onClose}
            >
              닫기
            </button>
          </div>
        )}
        <button
          className="notice-modal-close-button"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default NoticeDetail;
