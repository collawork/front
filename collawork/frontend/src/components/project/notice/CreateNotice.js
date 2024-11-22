import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../components/assest/css/CreateNotice.css";

const CreateNotice = ({ isOpen, onClose, projectId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [important, setImportant] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("important", important);

    // 파일 추가
    attachments.forEach((file) => {
        formData.append("attachments", file);
    });

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("토큰이 없습니다.");
        return;
    }

    try {
        await axios.post(`${API_URL}/api/projects/${projectId}/notices`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        alert("공지사항이 작성되었습니다.");
        onClose(); // 모달 닫기
    } catch (error) {
        console.error("공지사항 작성 중 오류 발생:", error);
    }
};


//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

  if (!isOpen) return null;

  return (
    <div className="notice-modal-overlay"> {/* onClick={handleOverlayClick} */}
      <div className="notice-modal-content">
        <h2>공지사항 작성</h2>
        <form onSubmit={handleSubmit}>
          {/* 제목 */}
          <div className="form-group">
            <label>
              <span className="required">*</span> 제목:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* 중요 여부 */}
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={important}
                onChange={(e) => setImportant(e.target.checked)}
              />
              중요
            </label>
          </div>

          {/* 첨부파일 */}
          <div className="form-group">
            <label>첨부파일:</label>
            <input type="file" multiple onChange={handleFileUpload} />
            <ul className="attachment-list">
              {attachments.map((file, index) => (
                <li key={index}>
                  {file.name}
                  <button
                    type="button"
                    className="remove-attachment-btn"
                    onClick={() => removeAttachment(index)}
                  >
                    제거
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 공지 내용 */}
          <div className="form-group">
            <label>공지 내용:</label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="공지 내용을 입력하세요..."
            />
          </div>

          {/* 액션 버튼 */}
          <div className="modal-actions">
            <button type="submit" className="notice-create-btn">
              작성
            </button>
            <button
              type="button"
              className="notice-close-btn"
              onClick={onClose}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNotice;
