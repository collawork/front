import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../components/assest/css/CreateNotice.css";

const NoticeForm = ({ projectId, notice, onSubmit, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [important, setImportant] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);

  useEffect(() => {
    if (notice) {
      // 기존 데이터를 폼에 세팅
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

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (index) => {
    setExistingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", title || ""); // 제목 추가
    formData.append("content", content || ""); // 내용 추가
    formData.append("important", important ? "true" : "false"); // 중요 여부 추가
  
    // 기존 첨부파일 처리
    existingAttachments.forEach((file, index) => {
      formData.append(`existingAttachments[${index}]`, JSON.stringify(file));
    });
  
    // 새 첨부파일 처리
    attachments.forEach((file) => {
      formData.append("attachments", file);
    });
  
    console.log("NoticeForm에서 생성된 FormData:");
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  
    try {
      await onSubmit(formData); // 여기에서 FormData 전달
    } catch (error) {
      console.error("onSubmit 호출 중 오류 발생:", error);
    }
  };
  

  if (!notice && !onClose) return null;

  return (
    <div className="notice-modal-overlay">
      <div className="notice-modal-content">
        <h2>{notice ? "공지사항 수정" : "공지사항 작성"}</h2>
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

          {/* 기존 첨부파일 */}
          <div className="form-group">
            <label>기존 첨부파일:</label>
            {existingAttachments.length > 0 ? (
              <ul className="attachment-list">
                {existingAttachments.map((file, index) => (
                  <li key={index}>
                    {file.fileName}
                    <button
                      type="button"
                      className="remove-attachment-btn"
                      onClick={() => removeExistingAttachment(index)}
                    >
                      제거
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>첨부파일 없음</p>
            )}
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

export default NoticeForm;
