import { useState, useEffect } from 'react';
import ReactModal from "react-modal";
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { stateValue, projectStore } from '../store';
import '../components/assest/css/Aside.css';

const API_URL = process.env.REACT_APP_API_URL;

const Aside = () => {
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
    const { setHomeShow, setChatShow, setCalShow, setNotiShow, setVotig } = stateValue();

    // 친구 목록 가져오기
    const fetchFriends = async () => {
        const token = localStorage.getItem('token');
        if (!token || !userId) {
            console.warn("토큰 또는 userId가 없습니다.");
            return;
        }
    
        try {
            const response = await axios.get(`${API_URL}/api/friends/list`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { userId },
            });
    
            //console.log("친구 목록 데이터:", response.data);
    
            // 필터링 로직 디버깅
            const filteredFriends = response.data.reduce((acc, friend, index) => {
                // console.log(`friend[${index}].requester.id: ${friend.requester.id}`);
                // console.log(`friend[${index}].responder.id: ${friend.responder.id}`);
                // console.log(`friend[${index}].status: ${friend.status}`);
    
                if (friend.status !== 'ACCEPTED') {
                    console.warn(`friend[${index}]가 ACCEPTED 상태가 아닙니다.`);
                    return acc;
                }
    
                if (String(friend.requester.id) === String(userId)) {
                    acc.push({
                        id: friend.responder.id,
                        username: friend.responder.username,
                        email: friend.responder.email
                    });
                } else if (String(friend.responder.id) === String(userId)) {
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
    
            //console.log("필터링된 친구 목록:", filteredFriends);
    
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

        try {
            const response = await axios.post(
                `${API_URL}/api/user/projects/selectAll`,
                { userId: Number(userId) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("프로젝트 목록:", response.data);

            if (Array.isArray(response.data)) {
                setProjectName(response.data);
            } else {
                console.warn("API 응답이 배열이 아닙니다. 빈 배열로 설정합니다.");
                setProjectName([]);
            }
        } catch (error) {
            console.error("프로젝트 목록을 불러오는 중 오류 발생:", error);
            setProjectName([]); // 오류 발생 시 빈 배열로 초기화
        }
    };

    

    // 초기 데이터 로드
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (userId && token) {
            fetchFriends();
            selectProjectName();
        }
    }, [userId]);

    useEffect(() => {
        if (newShow) {
            fetchFriends();
        }
    }, [newShow]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem("token");
        const participantIds = participants.map((participant) => participant.id);
    
        console.log("전송 데이터 확인:", {
            title,
            context,
            userId,
            participants: participantIds, // 숫자 배열인지 확인해야됨
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
    
            alert("프로젝트가 생성되었습니다.");
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
    const moveProjectHome = (projectName) => {
        addTitle(projectName); // 전역 상태에 프로젝트 이름 저장
        setHomeShow(true); // 홈 화면 상태 변경
        setChatShow(false);
        setCalShow(false);
        setNotiShow(false);
        setVotig(false);
        console.log("선택된 프로젝트 이름:", projectName);
    };

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

            <div className="aside">
                <div className="aside-top">
                    <div>collawork</div>
                    <button onClick={() => setNewShow(true)}>+ 새 프로젝트</button>
                </div>

                <div className="aside-bottom">
                    {projectName.map((project, index) => (
                        <section key={index}>
                            <li>
                                <button onClick={() => moveProjectHome(project)}>{project}</button>
                            </li>
                        </section>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Aside;
