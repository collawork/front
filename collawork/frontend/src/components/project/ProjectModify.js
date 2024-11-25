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
  const [id, setId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  // const [modalContent, setModalContent] = useState("");
  const { projectData, userData ,PlusListState} = projectStore();
  const { userId } = useUser();
  const [title, setTitle] = useState("");
  const {setHomeShow, setChatShow,setCalShow,setNotiShow,setVotig, PlusProjectInformationState} = stateValue();


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
      }));
      setParticipant(formattedParticipants);
      console.log(formattedParticipants);
    } catch (error) {
      console.error("참여자 목록을 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModify(false); 
      }
    };
  
   
    document.addEventListener("mousedown", handleClickOutside);
  
   
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
    // const userIdValue = typeof userId === "object" && userId !== null ? userId.userId : userId;
    const token = localStorage.getItem('token');
    axios({
      url: `${API_URL}/api/user/projects/managerModify`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { email:id, projectId: projectData.id },
    }).then(response => {
      console.log(response.data);
      setManagerModalOpen(false);
      setModify(false);
      // PlusProjectInformationState(false);
    });
  };

  const onSubmitHandler = () => {
    // e.preventDefault();
    console.log("클릭하면 넘오와댜되는 id :: " + id)
    if (id) {
      if(id !== String(userData.id)){
        managerModify();
      }else{
        alert("이미 관리자 입니다.");
        return;
      }
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

  const changeHandler = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setId(e.target.value);
    console.log(id);
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
    <h4>관리자로 변경 할 참가자를 선택하세요.</h4>
    {participant.map((part) => (
    <li key={part.email}>
      <input
        type="radio"
        id={`participant-${part.email}`}
        name="adminParticipant"
        value={part.email}
        onChange={(e) => changeHandler(e)}
        // checked={id === part.id} 
      />
      <label htmlFor={`participant-${part.email}`}>
        {console.log(part.email)}
        {part.id}
        {part.name} - {part.email}
      </label>
    </li>
  ))}
  </ul>
  <button onClick={onSubmitHandler}>변경하기</button>
  <button onClick={() => setManagerModalOpen(false)}>취소</button>
</ReactModal>
  </>
  )
}


export default ProjectModify;
