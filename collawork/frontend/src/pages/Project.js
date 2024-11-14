import { useNavigate, useLocation} from 'react-router-dom';
import ProjectHome from '../components/project/ProjectHome';
import ProjectChat from "../components/project/ProjectChat";
import ProjectCalendar from "../components/project/ProjectCalendar";
import { useState } from 'react';
import '../components/assest/css/Project.css'; 
import Board from '../components/project/Board';
import { useUser } from '../context/UserContext';
import Voting from '../components/project/Voting';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse,faCheckToSlot,faComment,faBell,faCalendarDays} from "@fortawesome/free-solid-svg-icons";



const Project = () => {
    
    const token = localStorage.getItem("token");
    console.log("현재 로그인한 사용자의 token : " + token);

    const { userId } = useUser();
    console.log("Project 페이지의 userId: ", userId);

    const [homeShow, setHomeShow] = useState(true); // 피드
    const [chatShow, setChatShow] = useState(false); // 채팅
    const [calShow, setCalShow] = useState(false); // 캘린더
    const [notiShow, setNotiShow] = useState(false); // 공지사항
    const [voting, setVotig] = useState(false); // 투표
   
    const homeClickHandler = () => {
        setHomeShow(true);
        setChatShow(false);
        setCalShow(false);
        setNotiShow(false);
        setVotig(false);
    };

    const chatClickHandler = () => {
        setChatShow(true);
        setHomeShow(false);
        setCalShow(false);
        setNotiShow(false);
        setVotig(false);
    };

    const onClickHandler = () => {
        setHomeShow(false);
        setChatShow(false);
        setCalShow(true);
        setNotiShow(false);
        setVotig(false);
    };

    const notiClickHandler = () => {
        setNotiShow(true);
        setHomeShow(false);
        setChatShow(false);
        setCalShow(false);
        setVotig(false);

    }

    const AllOnClickHandler = () => {
        setNotiShow(false);
        setHomeShow(false);
        setChatShow(false);
        setCalShow(false);
        setVotig(true);
    }

    // const clickHandler = (e) => {
    //     setShow(e.target.c);

    // }


    return (
        
        <div className="project-container">
            <div className="button-group">
                <button onClick={homeClickHandler}><FontAwesomeIcon icon={faHouse}/> 피드</button>
                <button onClick={notiClickHandler}><FontAwesomeIcon icon={faBell} /> 공지사항</button>
                <button onClick={chatClickHandler}><FontAwesomeIcon icon={faComment} /> 채팅방</button>
                <button onClick={onClickHandler}><FontAwesomeIcon icon={faCalendarDays} /> 캘린더</button>
                <button onClick={AllOnClickHandler}><FontAwesomeIcon icon={faCheckToSlot} /> 투표</button>
            </div>

            <div className="content-area">

                {homeShow && <ProjectHome setHomeShow={setHomeShow}/>}
                {chatShow && <ProjectChat />}
                {calShow && <ProjectCalendar />}
                {notiShow && <Board />}
                {voting && <Voting/>}
            </div>
        </div>
    );
};

export default Project;