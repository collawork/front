import { useState, useEffect } from 'react';
import ReactModal from "react-modal";
import ProjectService from "../services/ProjectService";
import axios from 'axios';
import { useUser } from '../context/UserContext';
import ProjectHome from './project/ProjectHome';
import {projectStore} from '../store'; 
import Project from '../pages/Project';
import ProjectImformation from './project/ProjectInformation';

const API_URL = process.env.REACT_APP_API_URL;

const Aside = ({userId}) => {
    
    const [projectName, setProjectName] = useState([]);
    const [title, setTitle] = useState("");
    const [context, setContext] = useState("");
    // const { userId } = useUser();
    const [ show, setShow ] = useState(false);
    const [newShow, setNewShow] = useState(false);
    // const [clickProjectName, setClickProjectName] = useState();
    const addTitle = projectStore(state => state.PlusProjectName);

   
    function selectProjectName() {
        console.log("userId: " + userId);
        const token = localStorage.getItem('token');
        const userIdValue = typeof userId === 'object' && userId !== null ? userId.userId : userId;
        console.log("userId: " + userId);
        axios({
            url: `${API_URL}/api/user/projects/selectAll`,
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` ,
                        'Content-Type': 'application/json',
                    },
            method: 'post',
            params: { userId: userIdValue },
            baseURL: 'http://localhost:8080',
            withCredentials: true,
        }).then(function(response) {
            console.log(response);
            setProjectName(response.data);
            console.log("Aside : " + response.data);
        });
    }
    
    useEffect(() => {
        if (userId) selectProjectName();
    }, []);


    function Send(){
        const userIdValue = typeof userId === 'object' && userId !== null ? userId.userId : userId;
        axios({
            url: `${API_URL}/api/user/projects/newproject`,
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            method: 'post',
            params: { title, context, userIdValue },
            baseURL: 'http://localhost:8080',
            withCredentials: true,
        }).then(function(response) {
            console.log("Aside : " + response);
            console.log("Aside : " + response.data);
        });
    }

    const modalCloseHandler = () => {
        setNewShow(false);
        setTitle("");
        setContext("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) {
            alert("프로젝트의 이름을 입력해주세요.");
            return;
        }
        try {
            Send(title, context);
            alert('새 프로젝트가 생성되었습니다.');
            selectProjectName();
            setNewShow(false);
        } catch (error) {
            alert('프로젝트 생성에 실패하였습니다.');
        }
    };

    const handleInputChange1 = (e) => {
        setTitle(e.target.value);
    };

    const handleInputChange2 = (e) => {
        setContext(e.target.value);
    };

    const moveProjectHome = (e) => {
        // setClickProjectName(e.target.textContent);
        addTitle(e.target.textContent);
        console.log(e.target.textContent);
        setShow(true);
    };

    return (
        <>
            <ReactModal
                isOpen={newShow}
                contentLabel="새 프로젝트"
                appElement={document.getElementById('root')}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        borderRadius: 0,
                        border: "none",
                        padding: '20px',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    }
                }}
            >
                <h2>프로젝트 만들기</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        placeholder="제목을 입력하세요"
                        onChange={handleInputChange1}
                        value={title}
                        required
                    />
                    <textarea
                        name="context"
                        placeholder='프로젝트 설명을 입력하세요.'
                        onChange={handleInputChange2}
                        value={context}
                    />
                    <div>
                        <button type="submit">프로젝트 생성</button>
                        <button type="button" onClick={modalCloseHandler}>취소</button>
                    </div>
                </form>
            </ReactModal>

            <div className="aside">
                <div className="aside-top">
                    <div>collawork</div>
                    <button onClick={() => setNewShow(true)}>+ 새 프로젝트</button>
                </div>

                <div className="aside-bottom">
                    {projectName.map((project, index) => (
                        <section key={index}>
                            <li>
                                <button onClick={(e)=> moveProjectHome(e)}>{project}</button>
                                {/* css 로 버튼 디자인 제거하기 */}
                            </li>
                        </section>
                       
                    ))}
                </div>
            </div>
        </>
    );
};

export default Aside;
