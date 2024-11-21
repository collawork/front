import { useEffect, useMemo, useState } from "react";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import { projectStore } from "../../store";
import { useUser } from "../../context/UserContext";

const API_URL = process.env.REACT_APP_API_URL;

const Board = () => {
  const [content, setContent] = useState(""); 
  const [savedContent, setSavedContent] = useState(""); 
  const [title, setTitle] = useState("");
  const { userId } = useUser();
  const { projectData } = projectStore();
  const [boardList, setBoardList] = useState([]); // 불러온 공지사항 list 출력

  useEffect(() => {
    ListSend(); 
  }, []);


  function ListSend(){ // 공지사항에 있는 글 불러오는 요청

    const token = localStorage.getItem("token");

    axios({
        url: `${API_URL}/api/user/projects/findBoard`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        method: "post",
        params: {
          projectId:projectData.id, // 프로젝트 id
        }
      }).then((response) => {
            console.log(response.data);
            setBoardList(response.data);
        })
        .catch((error) => {
            console.error("공지사항 등록 중 error : " + error);
        });
  }

 
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

  const removePTags = (value) => {
    setContent(value);

    
    const parser = new DOMParser();
    const doc = parser.parseFromString(value, "text/html");

   
    const cleanedValue = doc.body.textContent || doc.body.innerHTML;
    setSavedContent(cleanedValue.trim());
    console.log(cleanedValue.trim());
};


  function Send(){ // 공지사항 insert 요청

    const token = localStorage.getItem("token");
    const userIdValue =
        typeof userId === "object" && userId !== null
            ? userId.userId
            : userId;
          console.log(projectData.id);
          console.log(title);
          console.log(savedContent);
          console.log(userIdValue);

    axios({
        url: `${API_URL}/api/user/projects/newBoard`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        method: "post",
        params: {
          projectId:projectData.id, // 프로젝트 id
          boardTitle:title, // 제목
          boardContents:savedContent, // 내용
          boardBy:userIdValue, // 작성자 id
        }
      }).then((response) => {
            console.log("Response Data:", response.data);
        })
        .catch((error) => {
            console.error("공지사항 등록 중 error : " + error);
        });
  };
  
  const handleSave = () => {
    Send();
    ListSend();
    setTitle("");
    setContent(""); 
    alert("등록 성공!");
  };

  return (
    <>
    <div style={{ padding: "20px" }}>
      <h2>공지사항</h2>
     <input type="text" name="title" placeholder="제목을 입력해주세요." onChange={(e)=>setTitle(e.target.value)}/>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        style={{ height: "150px", width: "600px", marginBottom: "30px" }} 
        value={content}
        onChange={(value) => removePTags(value)} 
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
      <ul>
      {boardList.map((item,index)=>(
        <li key={index}>
          <h4>{item.boardTitle}</h4>
          <h4>{item.boardContents}</h4>
          <h4>{item.boardBy}</h4>
          <h4>{item.boardAt}</h4>
        </li>
    ))}
    </ul>

    </>
  );
}
export default Board;
