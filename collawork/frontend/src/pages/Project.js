import ProjectHome from '../components/project/ProjectHome';
import ChatRoom from "../components/Chat/ChatRoom";
//import ProjectCalendar from "../components/project/ProjectCalendar";
import '../components/assest/css/Project.css'; 
import Board from '../components/project/Board';
import { useState } from "react";
import { useUser } from '../context/UserContext';
import { stateValue } from '../store';
import Voting from '../components/project/Voting/ShowVoting';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse,faCheckToSlot,faComment,faBell,faCalendarDays} from "@fortawesome/free-solid-svg-icons";
import { Calendar } from '../components/calendar/Calendar'; 
import {projectStore} from '../store';
import NoticeList from '../components/project/notice/NoticeList';




const Project = ({projectId}) => {

    const {projectData} = projectStore(); 
    const [selected, setSelected] = useState("home"); // Default selected item
    const token = localStorage.getItem("token");
    console.log("현재 로그인한 사용자의 token : " + token);

    const { userId } = useUser();
    console.log("Project 페이지의 userId: ", userId);
    const {homeShow,chatShow,calShow, notiShow,voting,
        setHomeShow,setChatShow,setCalShow,setNotiShow,setVotig
    } = stateValue();
    
    const homeClickHandler = () => {
        if(projectData){
            console.log(projectData.id);
            setHomeShow(true);
            setChatShow(false);
            setCalShow(false);
            setNotiShow(false);
            setVotig(false);
            setSelected("home")
        }
    };

    const chatClickHandler = () => {
        if(projectData){
        setChatShow(true);
        setHomeShow(false);
        setCalShow(false);
        setNotiShow(false);
        setVotig(false);
        setSelected("chat")

        }
    };

    const onClickHandler = () => {
        if(projectData ){
        setHomeShow(false);
        setChatShow(false);
        setCalShow(true);
        setNotiShow(false);
        setVotig(false);
        setSelected("calendar")
        }
    };

    const notiClickHandler = () => {
        if(projectData){
        setNotiShow(true);
        setHomeShow(false);
        setChatShow(false);
        setCalShow(false);
        setVotig(false);
        setSelected("noti")
        }

    }

    const AllOnClickHandler = () => {
        if(projectData){
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
              className={`menu-item ${selected === "home" ? "active" : ""}`}
              onClick={homeClickHandler}
            >
              <span className="menu-label"> <FontAwesomeIcon icon={faHouse} /> 피드</span>
            </div>
            <div
              className={`menu-item ${selected === "noti" ? "active" : ""}`}
              onClick={notiClickHandler}
            >
              <span className="menu-label"><FontAwesomeIcon icon={faBell} /> 공지사항</span>
            </div>
            <div
              className={`menu-item ${selected === "chat" ? "active" : ""}`}
              onClick={chatClickHandler}
            >
              <span className="menu-label"><FontAwesomeIcon icon={faComment} /> 채팅방</span>
            </div>
            <div
              className={`menu-item ${selected === "calendar" ? "active" : ""}`}
              onClick={onClickHandler}
            >
              <span className="menu-label"><FontAwesomeIcon icon={faCalendarDays} /> 캘린더</span>
            </div>
            <div
              className={`menu-item ${selected === "voting" ? "active" : ""}`}
              onClick={AllOnClickHandler}
            >
              <span className="menu-label"><FontAwesomeIcon icon={faCheckToSlot} /> 투표</span>
            </div>
          </div>
    
          <div className="content-area">
            {selected === "home" && <ProjectHome />}
            {selected === "noti" && projectData && <NoticeList projectId={projectData.id} />}
            {selected === "chat" && projectData && <ChatRoom projectId={projectData.id}/>}
            {selected === "calendar" && projectData && <Calendar projectId={projectData.id}/>}
            {selected === "voting" && projectData && <Voting projectId={projectData.id}/>}
          </div>
        </div>
      );
    }

export default Project;