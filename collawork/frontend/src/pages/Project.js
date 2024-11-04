import { useNavigate, useLocation} from 'react-router-dom';
import ProjectHome from '../components/project/ProjectHome';
import ProjectChat from "../components/project/ProjectChat";
import ProjectCalendar from "../components/project/ProjectCalendar";
import NewProject from "../components/project/NewProject";
import { useState } from 'react';
import './Project.css'; 
import Notification from '../components/project/Notification';

const Project = () => {
    
    const [homeShow, setHomeShow] = useState(true);
    const [chatShow, setChatShow] = useState(false);
    const [calShow, setCalShow] = useState(false);
    const [notiShow, setNotiShow] = useState(false);
    // const newProjectShow = location.state.newProjectShow;
    // const setNewProjectShow = location.state.setNewProjectShow;

    const homeClickHandler = () => {
        setHomeShow(true);
        setChatShow(false);
        setCalShow(false);
    };

    const chatClickHandler = () => {
        setChatShow(true);
        setHomeShow(false);
        setCalShow(false);
    };

    const onClickHandler = () => {
        setHomeShow(false);
        setChatShow(false);
        setCalShow(true);
    };


    return (
        
        <div className="project-container">
            <div className="button-group">
                <button onClick={homeClickHandler}>피드</button>
                <button>공지사항</button>
                <button onClick={chatClickHandler}>채팅방</button>
                <button onClick={onClickHandler}>캘린더</button>
               
            </div>

            <div className="content-area">

                {homeShow && <ProjectHome setHomeShow={setHomeShow} />}
                {chatShow && <ProjectChat setChatShow={setChatShow} />}
                {calShow && <ProjectCalendar setCalShow={setCalShow} />}
                {notiShow && <Notification setNotiShow={setNotiShow} />}
            </div>
        </div>
    );
};

export default Project;
