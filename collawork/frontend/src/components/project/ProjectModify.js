import { useRef, useState, useEffect } from "react";
import ReactModal from "react-modal";
import { projectStore } from '../../store';
import { useUser } from '../../context/UserContext';
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const ProjectModify = ({ setModify }) => {
  const [modalShow, setModalShow] = useState(true); 
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [nameModalOpen, setNameModalOpen] = useState(false); 
  const [managerModalOpen, setManagerModalOpen] = useState(false); 
  const [exitModalOpen, setExitModalOpen] = useState(false); 
  const [participant, setParticipant] = useState([]);
  const [id, setId] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const { projectData, userData } = projectStore();
  const { userId } = useUser();
  const [title, setTitle] = useState("");

  const fetchAcceptedParticipants = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("토큰이 없습니다.");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/api/user/projects/${projectData.id}/participants/accepted`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const formattedParticipants = response.data.map((participant) => ({
        name: participant.username || "이름 없음",
        email: participant.email || "이메일 없음",
        id: participant.id,
      }));
      setParticipant(formattedParticipants);
    } catch (error) {
      console.error("참여자 목록을 가져오는 중 오류 발생:", error);
    }
  };

  const openModal = (e, content) => {
    const rect = e.target.getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + window.scrollY + 5, 
      left: rect.left + window.scrollX,
    });
    setModalContent(content);
    setModalOpen(true);
  };

  useEffect(() => {
    if (managerModalOpen) {
      fetchAcceptedParticipants();
    }
  }, [managerModalOpen]);

  const managerModifyHandler = () => {
    if (String(userId) === String(userData.id)) {
      setManagerModalOpen(true);
      // setModify(false);
    } else {
      alert("관리자 권한이 없습니다.");
    }
  };

  const projectNameModifyHandler = () => {
    if (String(userId) === String(userData.id)) {
      setNameModalOpen(true);
      // setModify(false);
    } else {
      alert("관리자 권한이 없습니다.");
    }
  };

  const nameModify = () => {
    const token = localStorage.getItem('token');
    axios({
      url: `${API_URL}/api/user/projects/nameModify`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { id: projectData.id, name: title },
    }).then(response => {
      alert("프로젝트 이름이 변경되었습니다!");
      setNameModalOpen(false);
      setModify(false);
    });
  };

  const managerModify = () => {
    const token = localStorage.getItem('token');
    axios({
      url: `${API_URL}/api/user/projects/managerModify`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { id, projectId: projectData.id },
    }).then(response => {
      console.log(response.data);
      setManagerModalOpen(false);
      setModify(false);
    });
  };

  const onSubmitHandler = () => {
    if (id) {
      managerModify();
      
    } else {
      alert("변경할 참여자를 선택해주세요.");
    }
  };

  const outSend = () => {
    if (String(userId) === String(userData.id)) {
      alert("관리자는 탈퇴할 수 없습니다.");
      setModify(false);
      return;
    }
    const token = localStorage.getItem('token');
    axios({
      url: `${API_URL}/api/user/projects/deleteSend`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { userId, projectId: projectData.id },
    }).then(response => {
      alert("프로젝트를 탈퇴했습니다.");
      setExitModalOpen(false);
      setModify(false);
    });
  };

  const closeModal = () => {
    setModalOpen(false);
    setModify(false);
  };


  return (
    <>
     <ReactModal
  isOpen={modalShow}
  onRequestClose={() => setModalShow(false)}
  contentLabel="projectModify"
  appElement={document.getElementById("root")}
  style={{
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "300px", 
      padding: "10px", 
      borderRadius: "10px",
      border: "1px solid #ccc", 
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
  }}
>
  <button onClick={managerModifyHandler}>관리자 변경</button>
  <button onClick={projectNameModifyHandler}>프로젝트 이름 변경</button>
  <button onClick={() => setExitModalOpen(true)}>이 프로젝트 나가기</button>
</ReactModal>

<ReactModal
  isOpen={nameModalOpen}
  onRequestClose={() => setNameModalOpen(false)}
  contentLabel="nameModify"
  appElement={document.getElementById("root")}
  style={{
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "300px", 
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid #ccc",
    },
    overlay: {
      backgroundColor: "transparent",
    },
  }}
>
  <input
    type="text"
    placeholder="변경할 이름을 입력해주세요."
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />
  <button onClick={nameModify}>변경하기</button>
  <button onClick={() => setNameModalOpen(false)}>취소</button>
</ReactModal>


<ReactModal
  isOpen={managerModalOpen}
  onRequestClose={() => setManagerModalOpen(false)}
  contentLabel="managerModify"
  appElement={document.getElementById("root")}
  style={{
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "300px",
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid #ccc",
    },
    overlay: {
      backgroundColor:  "transparent",
    },
  }}
>
  <ul>
    {participant.map((part) => (
      <li key={part.id}>
        <button value={part.id} onClick={(e) => setId(e.target.value)}>
          {part.name} - {part.email}
        </button>
      </li>
    ))}
  </ul>
  <button onClick={onSubmitHandler}>변경하기</button>
  <button onClick={() => setManagerModalOpen(false)}>취소</button>
</ReactModal>

<ReactModal
  isOpen={exitModalOpen}
  onRequestClose={() => setExitModalOpen(false)}
  contentLabel="exitProject"
  appElement={document.getElementById("root")}
  style={{
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "300px",
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid #ccc",
    },
    overlay: {

      backgroundColor:  "transparent",
    },
  }}
>
  <p>정말 프로젝트를 나가시겠습니까?</p>
  <button onClick={outSend}>확인</button>
  <button onClick={() => setExitModalOpen(false)}>취소</button>
</ReactModal>

    </>
  );
};

export default ProjectModify;
