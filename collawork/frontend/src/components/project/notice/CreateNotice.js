import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../components/assest/css/CreateNotice.css";

const CreateNotice = ({ isOpen, onClose, projectId, notice, onSubmit, onNoticeCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [important, setImportant] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const quillRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (notice) {
      setTitle(notice.title || "");
      setContent(notice.content || "");
      setImportant(notice.important || false);
      setExistingAttachments(notice.attachments || []);
    }
  }, [notice]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index, isExisting = false) => {
    if (isExisting) {
      setExistingAttachments((prev) => prev.filter((_, i) => i !== index));
    } else {
      setAttachments((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content.replace(/<\/?[^>]+(>|$)/g, "").trim());
    formData.append("important", important);

    existingAttachments.forEach((file) => {
      formData.append("existingAttachments", JSON.stringify(file));
    });

    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("토큰이 없습니다.");
      return;
    }

    try {
      const url = notice
        ? `${API_URL}/api/projects/${projectId}/notices/${notice.id}`
        : `${API_URL}/api/projects/${projectId}/notices`;

      const response = await axios({
        method: notice ? "put" : "post",
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedNotice = response.data;

      alert(`공지사항이 ${notice ? "수정" : "작성"}되었습니다.`);

      if (onNoticeCreated) {
        onNoticeCreated(updatedNotice);
      }
      if (onSubmit) {
        onSubmit();
      }
      onClose();
    } catch (error) {
      console.error("작업 중 오류 발생:", error.response?.data || error.message);
      alert("작업 중 오류가 발생했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notice-modal-overlay">
      <div className="notice-modal-content">
        <h2>{notice ? "공지사항 수정" : "공지사항 작성"}</h2>
        <form onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label>첨부파일:</label>
            <input type="file" multiple onChange={handleFileUpload} />
            <ul className="attachment-list">
              {existingAttachments.map((file, index) => (
                <li key={`existing-${index}`}>
                  {file.name}
                  <button
                    type="button"
                    className="remove-attachment-btn"
                    onClick={() => removeAttachment(index, true)}
                  >
                    제거
                  </button>
                </li>
              ))}
              {attachments.map((file, index) => (
                <li key={`new-${index}`}>
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

          <div className="form-group">
            <label>공지 내용:</label>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={(value) => setContent(value.replace(/<\/?[^>]+(>|$)/g, "").trim())}
              placeholder="공지 내용을 입력하세요..."
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="notice-create-btn">
              {notice ? "수정하기" : "작성하기"}
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
