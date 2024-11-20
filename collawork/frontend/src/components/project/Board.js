import { useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Board = () => {
  const [content, setContent] = useState(""); // State for editor content
  const [savedContent, setSavedContent] = useState(""); // State for saved content

  // Define custom toolbar options
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }], // Header options
        ["bold", "italic", "underline", "strike"], // Text styling
        [{ list: "ordered" }, { list: "bullet" }], // List styles
        ["link", "image"], // Links and images
        ["clean"], // Remove formatting
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

 
  const handleSave = () => {
    setSavedContent(content); 
    alert("등록 성공 !"); 
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>공지사항</h2>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        style={{ height: "200px", width: "600px", marginBottom: "20px" }}
        value={content}
        onChange={(value) => setContent(value)} 
      />
     <button 
      style={{
        marginTop: "20px", 
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}

     onClick={handleSave}>등록하기</button>
    </div>
  );
};

export default Board;
