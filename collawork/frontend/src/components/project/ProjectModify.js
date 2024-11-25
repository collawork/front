import { useRef, useState } from "react";
import ReactModal from "react-modal";
import {projectStore, friendsList} from '../../store'
import { useUser } from '../../context/UserContext';
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const ProjectModify = ({setModify}) => {

    const [modalShow, setModalShow] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpen2, setModalOpen2] = useState(false);
    const modalBackground = useRef();
    const [id, setId] = useState(); // (담당자 변경 중) 클릭 한 user 의 id 담기
    const {participants,setParticipants } = friendsList(); // 프젝 참여자 목록 관리
    const {projectData, userData} = projectStore();
    const { userId } = useUser();
    const [title, setTitle] = useState();


    function nameModify(){ // 프로젝트 name 변경
        const token = localStorage.getItem('token');
       
        axios({
          url: `${API_URL}/api/user/projects/nameModify`, // 요청 만들어야댐
          headers: { 'Authorization': `Bearer ${token}` },
          method: 'post',
          params: { id: projectData.id , name:title}, // 프로젝트 id 랑 입력받은 title 값
          baseURL: 'http://localhost:8080',
        }).then(function(response) {
          console.log(response.data);
        });
    }

    function managerModify(){ // 프로젝트 담당자 변경
        // button 을 클릭 한 사람의 id 를 담아서 보낸다. 

        const token = localStorage.getItem('token');
    
        axios({
          url: `${API_URL}/api/user/projects/managerModify`,
          headers: { 'Authorization': `Bearer ${token}` },
          method: 'post',
          params: { id: id, projectId: projectData.id},
          baseURL: 'http://localhost:8080',
        }).then(function(response) {
            console.log(response.data);
        });

    }

    const managerModifyHandler = () => {
        if (userId !== userData.id) {
            alert("관리자 권한이 없습니다.");
            return;
          }
        setModalOpen2(true);
        managerModify();
        alert("관리자 변경이 완료되었습니다. ");
        setModify(false);

    }

    const cancelHandler = () => {
        setModalShow(false);
    }

    const projectNameModifyHandler = () => {
        if (userId !== userData.id) {
            alert("관리자 권한이 없습니다.");
            return;
          }
        setModalOpen(true);
        nameModify();
        alert("프로젝트 이름 변경이 완료되었습니다.");
        setModify(false);
    }
    return (

        <>
        <ReactModal
          isOpen={modalShow}
          onRequestClose={cancelHandler}
          contentLabel="projectModify"
          appElement={document.getElementById("root")}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              borderRadius: 0,
              border: "none",
              padding: "20px",
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
          }}
        >
          
        
        {/* 관리자 변경 버튼은 관리자만 누를 수 있도록 해야함. */}
        <button onClick={managerModifyHandler}>관리자 변경</button> 
        <button onClick={projectNameModifyHandler}>프로젝트 이름 변경</button>
        {modalOpen &&
        <div className={'btn-wrapper'} ref={modalBackground}>
         <input className={'modal-open-btn'} type="text" placeholder="변경 할 프로젝트 이름을 입력해주세요." 
         value={projectData.name} onChange={(e)=> setTitle(e.target.value)}/>
         </div>
         }
            {modalOpen2 &&
        <div className={'btn-wrapper'} ref={modalBackground}>
         {/* 프로젝트 참가자 리스트 모달로 띄우기 */}
         {participants.length ? (
                <ul>
                    {participants.map((participant, index) => (
                        <li key={index}>
                            <button onClick={()=> setId(participant.id)}>{participant.name}</button> - {participant.email}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>변경할 수 있는 참여자가 없습니다. </p>
            )
        }
         
         </div>
         }
         </ReactModal>
      </>
    );
  };

    

export default ProjectModify;