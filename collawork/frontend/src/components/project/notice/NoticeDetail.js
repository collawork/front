import React, { useEffect, useState } from "react";
import axios from "axios";
import NoticeForm from "./NoticeForm";
import { useUser } from "../../../context/UserContext";
import "../../../components/assest/css/NoticeDetail.css";

const NoticeDetail = ({ projectId, noticeId, isOpen, onClose, onNoticeUpdated }) => {
  const [notice, setNotice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { userId } = useUser();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (isOpen) {
      fetchNotice();
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

  const saveNotice = async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("토큰이 없습니다.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/projects/${projectId}/notices/${noticeId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("공지사항이 수정되었습니다.");
      setNotice(response.data);
      setIsEditing(false);
      if (onNoticeUpdated) {
        onNoticeUpdated();
      }
    } catch (error) {
      console.error("공지사항 수정 실패:", error);
      alert("공지사항 수정에 실패했습니다.");
    }
  };

  const deleteNotice = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("토큰이 없습니다.");
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/projects/${projectId}/notices/${noticeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("공지사항이 삭제되었습니다.");
      onClose();
    } catch (error) {
      console.error("공지사항 삭제 실패:", error);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !notice) return null;

  const isCreator = notice && String(notice.creatorId) === String(userId);

  return (
    <div className="notice-detail-overlay" onClick={handleOverlayClick}>
      <div className="notice-detail-content">
        {isEditing ? (
          <NoticeForm
            projectId={projectId}
            notice={notice}
            onSubmit={saveNotice}
            onClose={() => setIsEditing(false)}
          />
        ) : (
          <>
            <h2 className="notice-title">{notice.title}</h2>

            <table className="notice-detail-table">
              <tbody>
                <tr>
                  <th>작성자</th>
                  <td>{notice.creatorName || "알 수 없음"}</td>
                  <th>작성일</th>
                  <td>{new Date(notice.createdAt).toLocaleString()}</td>
                </tr>
                <tr>
                  <th>공지 유형</th>
                  <td>{notice.important ? "중요 공지" : "일반 공지"}</td>
                  <th>조회수</th>
                  <td>{notice.viewCount || 0}</td>
                </tr>
              </tbody>
            </table>

            <div className="notice-content">
              <h3>내용</h3>
              <p>{notice.content}</p>
            </div>

            {notice.attachments && notice.attachments.length > 0 && (
              <div className="notice-attachments">
                <h3>첨부파일</h3>
                <ul>
                  {notice.attachments.map((file, index) => (
                    <li key={index}>
                      <a
                        href={`${API_URL}${file.fileUrl}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.fileName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="notice-actions">
              {isCreator && (
                <>
                  <button className="notice-edit-button" onClick={() => setIsEditing(true)}>
                    수정
                  </button>
                  <button className="notice-delete-button" onClick={deleteNotice}>
                    삭제
                  </button>
                </>
              )}
              <button className="notice-back-button" onClick={onClose}>
                목록
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NoticeDetail;
