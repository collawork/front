import { useState, useEffect } from 'react';
import ReactModal from "react-modal";
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { projectStore } from '../store';

const API_URL = process.env.REACT_APP_API_URL;

const Aside = () => {
    const [projectName, setProjectName] = useState([]);
    const [title, setTitle] = useState("");
    const [context, setContext] = useState("");
    const { userId } = useUser();
    const [show, setShow] = useState(false);
    const [newShow, setNewShow] = useState(false);
    const addTitle = projectStore(state => state.PlusProjectName);

    useEffect(() => {
        console.log("프로젝트 목록 업데이트:", projectName);
        selectProjectName();
    }, []);


        async function selectProjectName(projectName) {
        const token = localStorage.getItem('token');

        if (!projectName) {
            console.error("프로젝트 이름이 설정되지 않았습니다.");
            return;
        }

        try {
            console.log("프로젝트 이름:", projectName);
            console.log("Authorization Token:", token);

            const response = await axios({
                url: `http://localhost:8080/api/user/projects/projectselect`,
                method: 'post',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: { projectName },
                withCredentials: true,
            });
            console.log("프로젝트 선택 응답 데이터:", response.data);
            return response.data;
        } catch (error) {
            console.error('프로젝트 선택 중 오류 발생:', error);
        }
    }


    async function Send() {
        const token = localStorage.getItem('token');
        const userIdValue = typeof userId === 'object' && userId !== null ? userId.userId : userId;

        console.log("새 프로젝트 전송 - Title:", title);
        console.log("새 프로젝트 전송 - Context:", context);
        console.log("새 프로젝트 전송 - UserId:", userIdValue);

        try {
            const response = await axios({
                url: `${API_URL}/api/user/projects/newproject`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                method: 'post',
                data: { title, context, userId: userIdValue }, // 데이터를 payload로 전달
                withCredentials: true,
            });
            console.log("프로젝트 생성 응답 데이터:", response.data);
        } catch (error) {
            console.error('프로젝트 생성 중 오류 발생:', error);
        }
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
            await Send();
            alert('새 프로젝트가 생성되었습니다.');
            selectProjectName(); // 프로젝트 목록 새로고침
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
        addTitle(e.target.textContent);
        console.log("선택된 프로젝트:", e.target.textContent);
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
                                <button onClick={(e) => moveProjectHome(e)}>{project}</button>
                            </li>
                        </section>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Aside;
