import ProjectHome from '../components/project/ProjectHome';
import ChatRoom from "../components/Chat/ChatRoom";
import '../components/assest/css/Project.css';
import { useState, useEffect } from "react";
import { useUser } from '../context/UserContext';
import { stateValue } from '../store';
import Voting from '../components/project/Voting/ShowVoting';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCheckToSlot, faComment, faBell, faCalendarDays,faPlus } from "@fortawesome/free-solid-svg-icons";
import { Calendar } from '../components/calendar/Calendar';
import { projectStore } from '../store';
import NoticeList from '../components/project/notice/NoticeList';



const Project = ({ projectId }) => {

  const { projectData } = projectStore();
  const [selected, setSelected] = useState("home"); 
  const token = localStorage.getItem("token");
  const [plusIcon, setPlusIcon] = useState(true);

  const { userId } = useUser();
  console.log("Project 페이지의 userId: ", userId);
  const { homeShow, chatShow, calShow, notiShow, voting,
    setHomeShow, setChatShow, setCalShow, setNotiShow, setVotig
  } = stateValue();

  const homeClickHandler = () => {
    if (projectData) {
      console.log(projectData.id);
      setHomeShow(true);
      setChatShow(false);
      setCalShow(false);
      setNotiShow(false);
      setVotig(false);
      setSelected("home");
    }else{
      setPlusIcon(true);
    }
  };

  const chatClickHandler = () => {
    if (projectData) {
      setChatShow(true);
      setHomeShow(false);
      setCalShow(false);
      setNotiShow(false);
      setVotig(false);
      setSelected("chat")
    }
  };

  const onClickHandler = () => {
    if (projectData) {
      setHomeShow(false);
      setChatShow(false);
      setCalShow(true);
      setNotiShow(false);
      setVotig(false);
      setSelected("calendar")
    }
  };

  const notiClickHandler = () => {
    if (projectData) {
      setNotiShow(true);
      setHomeShow(false);
      setChatShow(false);
      setCalShow(false);
      setVotig(false);
      setSelected("noti")
    }
  }

  const AllOnClickHandler = () => {
    if (projectData) {
      setNotiShow(false);
      setHomeShow(false);
      setChatShow(false);
      setCalShow(false);
      setVotig(true);
      setSelected("voting")
    }
  }

  return (
    <div className="project-container">
      <div className="button-group">
        <div
          className={`menu-item ${homeShow === true ? "active" : ""}`}
          onClick={homeClickHandler}
        >
          <span className="menu-label"> <FontAwesomeIcon icon={faHouse} /> 피드</span>
        </div>
        <div
          className={`menu-item ${notiShow === true ? "active" : ""}`}
          onClick={notiClickHandler}
        >
          <span className="menu-label"><FontAwesomeIcon icon={faBell} /> 공지사항</span>
        </div>
        <div
          className={`menu-item ${chatShow === true ? "active" : ""}`}
          onClick={chatClickHandler}
        >
          <span className="menu-label"><FontAwesomeIcon icon={faComment} /> 채팅방</span>
        </div>
        <div
          className={`menu-item ${calShow === true ? "active" : ""}`}
          onClick={onClickHandler}
        >
          <span className="menu-label"><FontAwesomeIcon icon={faCalendarDays} /> 캘린더</span>
        </div>
        <div
          className={`menu-item ${voting === true ? "active" : ""}`}
          onClick={AllOnClickHandler}
        >
          <span className="menu-label"><FontAwesomeIcon icon={faCheckToSlot} /> 투표</span>
        </div>
      </div>

      <div className="content-area">
        {homeShow && <ProjectHome />}
        {notiShow && <NoticeList />}
        {chatShow && <ChatRoom />}
        {calShow && <Calendar />}
        {voting && <Voting />}
      </div>
      { homeShow == false && 
        notiShow == false &&
        chatShow == false && 
        calShow == false && 
        voting == false && 
        <h5 style={{
        color:"gray",
        opacity:0.8,
        marginTop:"94px",
        fontSize:"20px",
        textAlign: "center",
        }}>프로젝트를 선택해주세요</h5>
        }
    
    </div>
  );
}

export default Project;