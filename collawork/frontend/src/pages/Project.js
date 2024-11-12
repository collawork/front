import { useNavigate, useLocation} from 'react-router-dom';
import ProjectHome from '../components/project/ProjectHome';
import ProjectChat from "../components/project/ProjectChat";
import ProjectCalendar from "../components/project/ProjectCalendar";
import { useState } from 'react';
import '../components/assest/css/Project.css'; 
import Notification from '../components/project/Board';
import { useUser } from '../context/UserContext';


const Project = () => {
    
    const token = localStorage.getItem("token");
    console.log("현재 로그인한 사용자의 token : " + token);

    const { userId } = useUser();
    console.log("Project 페이지의 userId: ", userId);

    const [homeShow, setHomeShow] = useState(true);
    const [chatShow, setChatShow] = useState(false);
    const [calShow, setCalShow] = useState(false);
    const [notiShow, setNotiShow] = useState(false);
   
    const homeClickHandler = () => {
        setHomeShow(true);
        setChatShow(false);
        setCalShow(false);
        setNotiShow(false);
    };

    const chatClickHandler = () => {
        setChatShow(true);
        setHomeShow(false);
        setCalShow(false);
        setNotiShow(false);
    };

    const onClickHandler = () => {
        setHomeShow(false);
        setChatShow(false);
        setCalShow(true);
        setNotiShow(false);
    };

    const notiClickHandler = () => {
        setNotiShow(true);
        setHomeShow(false);
        setChatShow(false);
        setCalShow(false);

    }


    return (
        
        <div className="project-container">
            <div className="button-group">
                <button onClick={homeClickHandler}>피드</button>
                <button onClick={notiClickHandler}>공지사항</button>
                <button onClick={chatClickHandler}>채팅방</button>
                <button onClick={onClickHandler}> 캘린더</button>
            </div>

            <div className="content-area">

                {homeShow && <ProjectHome />}
                {chatShow && <ProjectChat />}
                {calShow && <ProjectCalendar />}
                {notiShow && <Notification />}
            </div>
        </div>
    );
};

export default Project;