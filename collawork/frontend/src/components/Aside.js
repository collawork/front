import { useState, useEffect } from 'react';
import ReactModal from "react-modal";
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { stateValue, projectStore } from '../store';
import '../components/assest/css/Aside.css';
import Pagination from "../components/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus,faFolder,faFolderOpen} from "@fortawesome/free-solid-svg-icons";


const API_URL = process.env.REACT_APP_API_URL;

const Aside = ({ onProjectSelect, onInviteFriends  }) => {
    const [projectName, setProjectName] = useState([]);
    const [title, setTitle] = useState("");
    const [context, setContext] = useState("");
    const [friends, setFriends] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [isAllFriendsSelected, setIsAllFriendsSelected] = useState(false);
    const [isAllParticipantsSelected, setIsAllParticipantsSelected] = useState(false);
    const { userId } = useUser();
    const [newShow, setNewShow] = useState(false);
    const addTitle = projectStore(state => state.PlusProjectName);
    const {listState} = projectStore();
    const { setHomeShow, setChatShow, setCalShow, setNotiShow, setVotig } = stateValue();
    const [userRole, setUserRole] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const pageSize = 10; // 한 페이지에 표시할 프로젝트 수


    // 친구 목록 가져오기
    const fetchFriends = async () => {
        const token = localStorage.getItem('token');
        const userIdValue = typeof userId === 'object' && userId !== null ? userId.userId : userId;
        if (!token || !userIdValue) {
            console.warn("토큰 또는 userId가 없습니다.");
            return;
        }
    
        try {
            console.log(userId);
            console.log(userIdValue );
            console.log("토큰토큰 : " + token);
            const response = await axios.get(`${API_URL}/api/friends/list`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: { userId:userIdValue },
            });
    
       
    
            // 필터링 로직 디버깅
            const filteredFriends = response.data.reduce((acc, friend, index) => {
                if (friend.status !== 'ACCEPTED') {
                    console.warn(`friend[${index}]가 ACCEPTED 상태가 아닙니다.`);
                    return acc;
                }
    
                if (String(friend.requester.id) === String(userIdValue)) {
                    acc.push({
                        id: friend.responder.id,
                        username: friend.responder.username,
                        email: friend.responder.email
                    });
                } else if (String(friend.responder.id) === String(userIdValue)) {
                    acc.push({
                        id: friend.requester.id,
                        username: friend.requester.username,
                        email: friend.requester.email
                    });
                } else {
                    console.warn(`friend[${index}]에서 userId와 일치하지 않는 requester/responder를 찾을 수 없습니다.`);
                }
                return acc;
            }, []);
    
    
            setFriends(filteredFriends);
        } catch (error) {
            console.error('친구 목록을 불러오는 중 오류 발생:', error);
        }
    };
    

    // 프로젝트 목록 가져오기
    const selectProjectName = async () => {
        const token = localStorage.getItem("token");
    
        if (!token) {
            console.error("토큰이 없습니다.");
            return;
        }
    
        // userId 처리: 객체인지 확인하고 필요한 값 추출
        let userIdValue = typeof userId === "object" && userId !== null
            ? userId.id || userId.userId // 객체에서 id 또는 userId 추출
            : userId;
    
        // userId가 숫자인지 확인하고 변환
        if (!userIdValue || isNaN(Number(userIdValue))) {
            console.error("유효하지 않은 userId:", userIdValue);
            return;
        }
        userIdValue = Number(userIdValue);
    
        try {
            // API 요청
            const response = await axios.post(
                `${API_URL}/api/user/projects/selectAll`,
                { userId: Number(userIdValue) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            if (Array.isArray(response.data)) {
                const allProjects = response.data;
                setTotalPages(Math.ceil(allProjects.length / pageSize));
                const startIndex = (currentPage - 1) * pageSize;
                const endIndex = Math.min(startIndex + pageSize, allProjects.length);
                setProjectName(allProjects.slice(startIndex, endIndex));
            } else {
                console.warn("API 응답이 배열이 아닙니다:", response.data);
            }
        } catch (error) {
            console.error("프로젝트 목록을 불러오는 중 오류 발생:", error);
        }
    };
    
    
    

    // 선택된 프로젝트의 role 가져오기
    const fetchUserRole = async (projectId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("토큰이 없습니다.");
            return;
        }

        try {
            const response = await axios.get(
                `${API_URL}/api/user/${projectId}/role`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setUserRole(response.data.role);
        } catch (error) {
            console.error("사용자의 프로젝트 역할을 가져오는 중 오류 발생:", error);
        }
    };

    // 프로젝트 선택 시 처리
    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        fetchUserRole(project.id); // 현재 사용자의 역할 가져오기
        onProjectSelect(project); // 부모 컴포넌트에 선택된 프로젝트 전달
        fetchFriends(); // 선택된 프로젝트에 따라 친구 목록 업데이트
    };

        // 친구 초대
        const inviteFriends = () => {
            if (!selectedProject || !selectedProject.id) {
                alert("프로젝트를 선택해주세요.");
                return;
            }
            if (onInviteFriends && selectedFriends.length > 0 && selectedProject) {
                onInviteFriends(selectedProject, selectedFriends);
                alert(`${selectedFriends.length}명의 친구를 초대했습니다.`);
                setSelectedFriends([]);
                setIsAllFriendsSelected(false);
            } else {
                alert("초대할 친구를 선택하세요.");
            }
        };

    

    // 초기 데이터 로드
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userIdValue = typeof userId === 'object' && userId !== null ? userId.userId : userId;
        
        if (userIdValue && token) {
            fetchFriends();
            selectProjectName();
            console.log("현재 userId:", userIdValue);
            console.log("현재 selectedProject:", selectedProject);
        }
    }, [userId,listState]);

    useEffect(() => {
        if (newShow) {
            fetchFriends();
        }
    }, [newShow]);

    useEffect(() => {
        console.log("초기 userId:", userId);
    
        // userId가 객체일 경우 처리
        let userIdValue = typeof userId === "object" && userId !== null
            ? userId.id || userId.userId
            : userId;
    
        if (!userIdValue || isNaN(Number(userIdValue))) {
            console.error("userId가 초기화되지 않았습니다. 기본값 설정.");
            userIdValue = 1; // 기본값
        }
    
        selectProjectName();
    }, [userId]);
    

    const handleFriendSelection = (friend) => {
        setSelectedFriends((prev) =>
            prev.includes(friend) ? prev.filter((f) => f !== friend) : [...prev, friend]
        );
    };

    const handleParticipantSelection = (participant) => {
        setSelectedParticipants((prev) =>
            prev.includes(participant) ? prev.filter((p) => p !== participant) : [...prev, participant]
        );
    };

    const toggleSelectAllFriends = () => {
        if (isAllFriendsSelected) {
            setSelectedFriends([]);
        } else {
            setSelectedFriends(friends);
        }
        setIsAllFriendsSelected(!isAllFriendsSelected);
    };

    const toggleSelectAllParticipants = () => {
        if (isAllParticipantsSelected) {
            setSelectedParticipants([]);
        } else {
            setSelectedParticipants(participants);
        }
        setIsAllParticipantsSelected(!isAllParticipantsSelected);
    };

    const addParticipants = () => {
        const updatedParticipants = [...participants, ...selectedFriends];
        const updatedFriends = friends.filter((friend) => !selectedFriends.includes(friend));
        setParticipants(updatedParticipants);
        setFriends(updatedFriends);
        setSelectedFriends([]);
        setIsAllFriendsSelected(false);
    };

    const removeParticipants = () => {
        const updatedFriends = [...friends, ...selectedParticipants];
        const updatedParticipants = participants.filter((participant) => !selectedParticipants.includes(participant));
        setFriends(updatedFriends);
        setParticipants(updatedParticipants);
        setSelectedParticipants([]);
        setIsAllParticipantsSelected(false);
    };
        //여기 프로젝트 생성하기 누르기전에 채팅방 테이블 만들기 먼저
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem("token");

        const participantIds = participants.map(participant => participant.id || participant);

        console.log("전송 데이터 확인:", {
            title,
            context,
            userId,
            participants: participantIds, // 숫자 배열인지 확인
        });
    
        try {
            const response = await axios.post(
                `${API_URL}/api/user/projects/newproject`,
                {
                    title,
                    context,
                    userId,
                    participants: participantIds,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
    
            console.log("전송 데이터 확인:", { title, context, userId, participants: participantIds });

            alert("프로젝트가 생성되었습니다.");
            modalCloseHandler();
            selectProjectName();
            moveProjectHome(projectName);
        } catch (error) {
            console.error("프로젝트 생성 중 오류 발생:", error.response?.data || error.message);
            alert("프로젝트 생성에 실패하였습니다.");
        }
    };
    
    

    const modalCloseHandler = () => {
        setNewShow(false);
        setTitle("");
        setContext("");
        setParticipants([]);
        setSelectedFriends([]);
        setSelectedParticipants([]);
        setIsAllFriendsSelected(false);
        setIsAllParticipantsSelected(false);
        fetchFriends();
    };

    // 프로젝트 선택 시 피드에 정보 띄우는 함수
    function moveProjectHome (project) {
        // console.log("선택된 프로젝트:", project); 
        if (!project || !project.id || !project.name) {
            console.error("프로젝트 데이터가 유효하지 않습니다:", project);
            return;
        }
        addTitle(project.name); // 전역 상태에 프로젝트 이름 저장
        setHomeShow(true); // 홈 화면 상태 변경
        setChatShow(false);
        setCalShow(false);
        setNotiShow(false);
        setVotig(false);
        // console.log("onProjectSelect 전달 확인");
        onProjectSelect(project);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        selectProjectName();
    }, [currentPage, userId]);
    

    return (
        <>
            <ReactModal
                isOpen={newShow}
                contentLabel="새 프로젝트"
                onRequestClose={modalCloseHandler}
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
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                    }
                }}
            >
                <h2>프로젝트 만들기</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        placeholder="제목을 입력하세요"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        required
                    />
                    <textarea
                        name="context"
                        placeholder="프로젝트 설명을 입력하세요."
                        onChange={(e) => setContext(e.target.value)}
                        value={context}
                    />

                    <div className="participants-section">
                        <div className="friends-list">
                            <h4>
                                친구 목록
                                <input
                                    type="checkbox"
                                    checked={isAllFriendsSelected}
                                    onChange={toggleSelectAllFriends}
                                />
                            </h4>
                            <ul>                            
                                {friends.length > 0 ? (
                                    friends.map((friend) => (
                                        <li key={friend.id}>
                                            <input
                                                type="checkbox"
                                                checked={selectedFriends.includes(friend)}
                                                onChange={() => handleFriendSelection(friend)}
                                            />
                                            {friend.username || "이름 없음"} ({friend.email || "이메일 없음"})
                                        </li>
                                    ))
                                ) : (
                                    <p>친구 목록이 비어 있습니다.</p>
                                )}
                            </ul>

                        </div>

                        <div className="actions">
                            <button type="button" onClick={addParticipants}>{'>>'}</button>
                            <button type="button" onClick={removeParticipants}>{'<<'}</button>
                        </div>

                        <div className="participants-list">
                            <h4>
                                초대 목록
                                <input
                                    type="checkbox"
                                    checked={isAllParticipantsSelected}
                                    onChange={toggleSelectAllParticipants}
                                />
                            </h4>
                            <ul>
                                {participants.map((participant) => (
                                    <li key={participant.id}>
                                        <input
                                            type="checkbox"
                                            checked={selectedParticipants.includes(participant)}
                                            onChange={() => handleParticipantSelection(participant)}
                                        />
                                        {participant.username || "이름 없음"} ({participant.email || "이메일 없음"})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div>
                        <button type="submit">프로젝트 생성</button>
                        <button type="button" onClick={modalCloseHandler}>취소</button>
                    </div>
                </form>
            </ReactModal>

                    
                        <div className="aside-top">
                            <div className='wework'>wework</div>
                            <button 
                            className='plusbutton'
                            onClick={() => setNewShow(true)}>
                                <FontAwesomeIcon icon={faPlus} />
                            <FontAwesomeIcon icon={faFolder} className='righticon'/>
                            </button>
                            <br/>
                            <br/>
                        </div>

                        <div className="aside-bottom">
                     {projectName.map((project) => (
                    <section key={project.id}>
                    <span
                     className={`clickable-text ${selectedProjectId === project.id ? 'selected-project' : ''}`}
                    onClick={() => {
                        moveProjectHome(project);
                        setSelectedProjectId(project.id); // 클릭된 프로젝트 ID 저장
                    }}
                >
                <li>
                    {/* <FontAwesomeIcon icon={faFolderOpen} className='folderIcon' /> */}
                    {project.name}
                </li>
            </span>
        </section>
    ))}
</div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            
        </>
    );
};

export default Aside;
