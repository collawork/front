import ProjectHome from '../components/project/ProjectHome';
import ChatRoom from "../components/Chat/ChatRoom";
//import ProjectCalendar from "../components/project/ProjectCalendar";
import '../components/assest/css/Project.css'; 
import Board from '../components/project/Board';
import { useUser } from '../context/UserContext';
import { stateValue } from '../store';
import Voting from '../components/project/Voting/ShowVoting';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse,faCheckToSlot,faComment,faBell,faCalendarDays} from "@fortawesome/free-solid-svg-icons";
import { Calendar } from '../components/calendar/Calendar'; 
import {projectStore} from '../store';
import NoticeList from '../components/project/notice/NoticeList';



const Project = () => {

    const {projectData} = projectStore(); 
    
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
        }
    };

    const chatClickHandler = () => {
        if(projectData){
        setChatShow(true);
        setHomeShow(false);
        setCalShow(false);
        setNotiShow(false);
        setVotig(false);
        }
    };

    const onClickHandler = () => {
        if(projectData ){
        setHomeShow(false);
        setChatShow(false);
        setCalShow(true);
        setNotiShow(false);
        setVotig(false);
        }
    };

    const notiClickHandler = () => {
        if(projectData){
        setNotiShow(true);
        setHomeShow(false);
        setChatShow(false);
        setCalShow(false);
        setVotig(false);
        }

    }

    const AllOnClickHandler = () => {
        if(projectData){
        setNotiShow(false);
        setHomeShow(false);
        setChatShow(false);
        setCalShow(false);
        setVotig(true);
        }
    }

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

                {homeShow && <ProjectHome />}
                {chatShow && <ChatRoom />}
                {calShow && <Calendar />}
                {/* {calShow && <ProjectCalendar />} */}
                {/* {notiShow && <Board />} */}
                {notiShow && <NoticeList projectId={projectData?.id} />}
                {voting && <Voting/>}
            </div>
        </div>
    );
};

export default Project;