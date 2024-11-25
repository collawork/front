import { useRef, useState, useEffect } from "react";
import ReactModal from "react-modal";
import { projectStore,stateValue } from '../../store';
import { useUser } from '../../context/UserContext';
import axios from "axios";
// import { stateValue } from "../../store";
const API_URL = process.env.REACT_APP_API_URL;

const ProjectModify = ({ setModify }) => {
  const modalRef = useRef();
  const [modalShow, setModalShow] = useState(true); 
  // const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [nameModalOpen, setNameModalOpen] = useState(false); 
  const [managerModalOpen, setManagerModalOpen] = useState(false); 
  const [exitModalOpen, setExitModalOpen] = useState(false); 
  const [participant, setParticipant] = useState([]);
  const [id, setId] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  // const [modalContent, setModalContent] = useState("");
  const { projectData, userData ,PlusListState} = projectStore();
  const { userId } = useUser();
  const [title, setTitle] = useState("");
  const {setHomeShow, setChatShow,setCalShow,setNotiShow,setVotig} = stateValue();


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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModify(false); // Close modal when clicking outside
      }
    };
  
    // Add event listener to detect clicks
    document.addEventListener("mousedown", handleClickOutside);
  
    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


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
      PlusListState(false);
    });
  };

  const managerModify = () => {
    const userIdValue = typeof userId === "object" && userId !== null ? userId.userId : userId;
    const token = localStorage.getItem('token');
    axios({
      url: `${API_URL}/api/user/projects/managerModify`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { id:userIdValue, projectId: projectData.id },
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
    const userIdValue = typeof userId === "object" && userId !== null ? userId.userId : userId;
    
    axios({
      url: `${API_URL}/api/user/projects/deleteSend`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { userId:userIdValue, projectId: projectData.id },
    }).then(response => {
      alert("프로젝트를 탈퇴했습니다.");
      setExitModalOpen(false);
      setModify(false);
      PlusListState(true);
      // PlusProjectData('');
      setHomeShow('');
      setChatShow(''); 
      setCalShow('');
      setNotiShow('');
      setVotig('') ;
    });
  };

  const closeModal = () => {
    setModalOpen(false);
    setModify(false);
  };

  function projectDelete(){

    const token = localStorage.getItem('token');
    
    
    axios({
      url: `${API_URL}/api/user/projects/projectDelete`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: {projectId: projectData.id },
    }).then(response => {
      alert("프로젝트가 삭제되었습니다.");
      setExitModalOpen(false);
      setModify(false);
      PlusListState(true);
      // PlusProjectData('');
      setHomeShow('');
      setChatShow(''); 
      setCalShow('');
      setNotiShow('');
      setVotig('') ;
    });

  }

  const projectDeleteHandler = () => {
    if (String(userId) === String(userData.id)) {
      let result = window.confirm("정말 프로젝트를 삭제하시겠습니까 ? ");
      if(result){
        projectDelete(); // 프로젝트 삭제
      }else{
        return;
      }
    }else{
      alert("프로젝트 삭제는 관리자만 가능합니다.");
    }

  }

  const ExitModalOpen = () => {
    let result = window.confirm("정말 프로젝트를 나가시겠습니까 ? ");
    if(result){
      outSend();
    }else{
      return;
    }
  }


  return (
    <>
     <ReactModal
  isOpen={modalShow}
  closeModal={closeModal}
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
  <button onClick={ExitModalOpen}>이 프로젝트 나가기</button>
  <button onClick={projectDeleteHandler}>프로젝트 삭제</button>

  <button onClick={closeModal}>닫기</button>
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

 {/* <ReactModal
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
 </ReactModal> */}

    </>
  );
};

export default ProjectModify;
