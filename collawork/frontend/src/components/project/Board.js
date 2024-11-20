import { useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Board = () => {
  const [content, setContent] = useState(""); 
  const [savedContent, setSavedContent] = useState(""); 
  const [title, setTitle] = useState("");

 
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }], 
        ["bold", "italic", "underline", "strike"], 
        [{ list: "ordered" }, { list: "bullet" }], 
        ["link", "image"], 
        ["clean"],
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
    
    alert("등록 성공!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>공지사항</h2>
     <input type="text" name="title" placeholder="제목을 입력해주세요." onChange={(e)=>setTitle(e.target.value)}/>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        style={{ height: "150px", width: "600px", marginBottom: "30px" }} 
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
        onClick={handleSave}
      >
        게시하기
      </button>
    </div>
  );
};

export default Board;
