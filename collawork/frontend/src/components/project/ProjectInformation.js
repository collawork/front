import { useEffect, useState, useRef } from "react";
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import ReactModal from "react-modal";
import { projectStore, stateValue} from '../../store';
import defaultImage from '../../components/assest/images/default-profile.png';
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faThumbtack,faCalendar,faFolder,faGear,faBell} from "@fortawesome/free-solid-svg-icons";
import ProjectModify from "./ProjectModify";
import '../../components/assest/css/ProjectInformation.css';
// import ProjectBox from './ProjectBox';
import { Color } from "three";

const API_URL = process.env.REACT_APP_API_URL;

const ProjectInformation = () => {

  

  const [id, setId] = useState(null);
  const [participant, setParticipant] = useState([]);
  const modalRef = useRef();
  const [modal, setModal] = useState(false);
  const [show, setShow] = useState(false);
  const [managerModalOpen, setManagerModalOpen] = useState(false); 
  const [noticesList, setNoticesList] = useState([]); // 초기값 빈 배열
  const [modify, setModify] = useState(false);
  const [calendarList, setCalendarList] = useState([]); // 초기값 빈 배열
  const {setHomeShow,setChatShow,setCalShow,setNotiShow,setVotig} = stateValue();
  const { projectName, projectData, userData, PlusProjectData, PlusUserData ,projectInformationState} = projectStore();
  const { userId } = useUser();

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
    if (managerModalOpen) {
      fetchAcceptedParticipants();
    }
  }, [managerModalOpen]);


  useEffect(() => {
    if (projectName) {
      Send(); // 1. projectName으로 프로젝트 정보 조회
      setShow(true);
    }
  }, [projectName,projectInformationState]); 

  useEffect(() => {
    if (projectData && projectData.id) {  
      calendarSend(); // 다가오는 캘린더 일정(7일 이내)
      noticesSend(); // 등록된 중요 공지사항
      manager();
    }
  }, [projectData]); 


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function Send() {
    const token = localStorage.getItem('token');

    axios({
      url: `${API_URL}/api/user/projects/projectselect`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { projectName },
      baseURL: 'http://localhost:8080',
    }).then(function(response) {
      console.log(response);
      PlusProjectData(response.data[0]);
      if (!response.data || response.data.length === 0) {
        Send();
      }
    }).catch(err => console.error("프로젝트 정보 조회 오류:", err));
  }

  const changeHandler = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setId(e.target.value);
    console.log(id);
  }

  function calendarSend() { // 다가오는 (7일) 캘린더 조회
    const token = localStorage.getItem('token');
    const userIdValue = typeof userId === "object" && userId !== null ? userId.userId : userId;

    axios({
      url: `${API_URL}/api/user/projects/calendarList`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { projectId: projectData?.id, userId: userIdValue },
      baseURL: 'http://localhost:8080',
    }).then(function(response) {
      if (response.data) {
        setCalendarList(response.data);
      } else {
        setCalendarList([]); // 응답이 없을 경우 빈 배열로 설정
      }
    }).catch(err => console.error("캘린더 조회 오류:", err));
  }

  function noticesSend() { // 중요 공지사항 요청
    const token = localStorage.getItem('token');

    axios({
      url: `${API_URL}/api/user/projects/noticesSend`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { projectId: projectData?.id },
      baseURL: 'http://localhost:8080',
    }).then(function(response) {
      if (response?.data) {
        setNoticesList(response.data);
      } else {
        setNoticesList([]); // 응답이 없을 경우 빈 배열로 설정
      }
    }).catch(err => console.error("공지사항 조회 오류:", err));
  }



  function manager() {  // 담당자 정보 조회
    const token = localStorage.getItem('token');

    axios({
      url: `${API_URL}/api/user/projects/projecthomeusers`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { id: projectData?.createdBy },
      baseURL: 'http://localhost:8080',
    }).then(function(response) {
      PlusUserData(response.data);
    }).catch(err => console.error("유저 정보 조회 오류:", err));
  }


  // 담당자 변경
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
      alert("담당자가 변경되었습니다!");
      // PlusProjectInformationState(false);
    });
  };

  const managerModifyHandler = () => {
    if (String(userId) === String(userData.id)) {
      setManagerModalOpen(true);
      // setModify(false);
    } else {
      alert("관리자 권한이 없습니다.");
    }
  };

  const onSubmitHandler = () => {
    
    if (id) {
      if(id !== String(userData.email)){
        managerModify();
      }else{
        alert("현재 관리자 입니다.");
        return;
      }
    } else {
      alert("변경할 참여자를 선택해주세요.");
    }
  };

  const calendatHandler = () => {
    setHomeShow(false);
    setChatShow(false);
    setCalShow(true);
    setNotiShow(false);
    setVotig(false);
  }

  const noticesHandler = () => {
    setHomeShow(false);
    setChatShow(false);
    setCalShow(false);
    setNotiShow(true);
    setVotig(false);
  }


  return (
    <>
      {show && (
        <div className="project-box">
          <div className="project-container">
            <div className="project-header">
              <FontAwesomeIcon icon={faFolder} className="project-icon" />
              <h2>{projectData.projectName}</h2>
              <span className="project-code">{projectData.projectCode}</span>
              <button className="icon-button" onClick={() => setModify(true)}>
                <FontAwesomeIcon icon={faGear} />
              </button>
            </div>
  
            {/* 기존의 일정 및 공지사항 섹션 */}
            {calendarList.length > 0 ? (
              <ul className="list">
                {calendarList.map((calendarItem, index) => (
                  <li key={index} className="list-item">
                    <div className="icon-container">
                      <FontAwesomeIcon icon={faThumbtack} color="purple" className="icon" />
                      <FontAwesomeIcon icon={faCalendar} className="icon" />
                    </div>
                    <div className="list-content" onClick={calendatHandler}>
                      <h3>{calendarItem.title}</h3>
                      <p>
                        {new Date(calendarItem.start_time).toLocaleString()} ~{" "}
                        {new Date(calendarItem.end_time).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="list">
                <li className="list-item">
                  <div className="icon-container">
                    <FontAwesomeIcon icon={faThumbtack} color="purple" className="icon" />
                    <FontAwesomeIcon icon={faCalendar} className="icon" />
                  </div>
                  <div className="list-content" onClick={calendatHandler}>
                    <h3>다가오는 일정이 없습니다.</h3>
                  </div>
                </li>
              </ul>
            )}
  
            {noticesList.length > 0 ? (
              <ul className="list">
                {noticesList.map((list, index) => (
                  <li key={index} className="list-item">
                    <div className="icon-container">
                      <FontAwesomeIcon color="purple" icon={faThumbtack} className="icon" />
                      <FontAwesomeIcon icon={faBell} className="icon" />
                    </div>
                    <div className="list-content" onClick={noticesHandler}>
                      <h3>{list.title}</h3>
                      <p>{new Date(list.createdAt).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="list">
                <li className="list-item">
                  <div className="icon-container">
                    <FontAwesomeIcon color="purple" icon={faThumbtack} className="icon" />
                    <FontAwesomeIcon icon={faBell} className="icon" />
                  </div>
                  <div className="list-content" onClick={noticesHandler}>
                    <h3>주요 공지사항이 없습니다.</h3>
                  </div>
                </li>
              </ul>
            )}
  
  
            {/* 새로운 슬라이더 기능 추가 */}
            {/* <div className="slider-section">
              <h3>프로젝트 진행률</h3>
              <ProjectBox />
            </div>
   */}
            {modify && (
              <ProjectModify
                setModify={(value) => {
                  setModify(value);
                }}
              />
            )}
             <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                    position: "relative",
                  }}
                >
            
              <img
              src={userData?.profileImageUrl || defaultImage}
              alt={`${userData?.username || "사용자"}의 프로필 이미지`}
              onClick={() => setModal(!modal)}
              className="profile-image-small"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "10px",
                cursor: "pointer",
              }}
            />
            관리자 : <h3>{userData?.username || "정보 없음"}</h3>
            <button onClick={managerModifyHandler}>관리자 변경</button>
            </div>
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
                  backgroundColor: "transparent",
                },
              }}
            >
               <p>이름: {userData?.username || '정보 없음'}</p>
            <p>이메일: {userData?.email || '정보 없음'}</p>
            <p>회사명: {userData?.company || '정보 없음'}</p>
            <p>직급: {userData?.position || '정보 없음'}</p>
            <p>핸드폰 번호: {userData?.phone || '정보 없음'}</p>
            <p>fax: {userData?.fax || '정보 없음'}</p>

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
                  backgroundColor: "transparent",
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
                    />
                    <label htmlFor={`participant-${part.email}`}>
                      {part.id} {part.name} - {part.email}
                    </label>
                  </li>
                ))}
              </ul>
              <button onClick={onSubmitHandler}>변경하기</button>
              <button onClick={() => setManagerModalOpen(false)}>취소</button>
            </ReactModal>
  
            {/* ReactModal 코드 생략 */}
          </div>
          <h6>{projectData?.createdAt}</h6>
        </div>
      )}
    </>
  );
  
}
  

export default ProjectInformation;