import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Aside from "../components/Aside";
import Search from "../pages/Search";
import FriendList from "../components/Friend/FriendList";
import PendingInvitations from "../components/project/PendingInvitations";
import axios from "axios";
import "../components/assest/css/Layout.css";
import { useUser } from "../context/UserContext";
import { stateValue } from "../store";
import InviteModal from "./InviteModal"; // 초대 모달 컴포넌트
import { useNavigate } from "react-router-dom";
import { projectStore, calendarEvents } from '../store';

const Layout = () => {
    const { userId } = useUser();
    const [activeTab, setActiveTab] = useState("friends");
    const [participants, setParticipants] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const { setHomeShow, setChatShow, setCalShow, setNotiShow, setVotig } = stateValue();
    const [userRole, setUserRole] = useState(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const navigate = useNavigate();
    const { projectData, PlusProjectData} = projectStore();
    const {
        id, title, start, end, allDay, description, createdBy, createdAt, projectId,
        setId, setTitle, setStart, setEnd, setAllDay, setDescription, setCreatedBy, setCreatedAt, setProjectId
    } = calendarEvents();

    const API_URL = process.env.REACT_APP_API_URL;

    // 프로젝트 참여자 목록 가져오기
    const fetchAcceptedParticipants = async () => {
        if (!selectedProject || !selectedProject.id) {
            console.warn("선택된 프로젝트가 없습니다.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("토큰이 없습니다.");
            return;
        }

        try {
            const response = await axios.get(
                `${API_URL}/api/user/projects/${selectedProject.id}/participants/accepted`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const formattedParticipants = response.data.map((participant) => ({
                name: participant.username || "이름 없음",
                email: participant.email || "이메일 없음",
            }));

            setParticipants(formattedParticipants);
        } catch (error) {
            console.error("참여자 목록을 가져오는 중 오류 발생:", error);
        }
    };

    // 사용자 역할 가져오기
    const fetchUserRole = async () => {
        if (!selectedProject?.id) return;

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("토큰이 없습니다.");
            return;
        }

        try {
            const response = await axios.get(
                `${API_URL}/api/user/projects/${selectedProject.id}/role`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { userId },
                }
            );

            setUserRole(response.data.role);
        } catch (error) {
            console.error("사용자 역할을 가져오는 중 오류 발생:", error);
            setUserRole(null);
        }
    };

    useEffect(() => {
        if (activeTab === "participants") {
            fetchAcceptedParticipants();
        }
    }, [activeTab]);

    useEffect(() => {
        if (selectedProject && activeTab === "participants") {
            fetchAcceptedParticipants();
            fetchUserRole();
        }
    }, [selectedProject]);

    useEffect(() => {
        if (selectedProject) {
            fetchUserRole();
            fetchAcceptedParticipants();
        }
    }, [selectedProject]);

    const renderList = () => {
        if (activeTab === "friends") {
            return <FriendList userId={userId} />;
        } else if (activeTab === "participants") {
            return participants.length ? (
                <ul>
                    {participants.map((participant, index) => (
                        <li key={index}>
                            <strong>{participant.name}</strong> - {participant.email}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>참여자가 없습니다.</p>
            );
        } else if (activeTab === "pending") {
            return (
                <PendingInvitations
                    projectId={selectedProject?.id || null}
                    onInvitationChange={fetchAcceptedParticipants}
                />
            );
        }
    };

    
    const moveToMypage = () => {

        navigate('/main');
        // 홈버튼을 누르면 캘린더의 선택된 프로젝트 아이디가 null로 상태가 바뀌어야 하고, 홈화면의 달력은 개인 달력(프로젝트 아이디가 null인 스케쥴들)으로 출력한다.
        PlusProjectData('');
    }

    return (
        <div className="layout-container">
            <button
                onClick={moveToMypage}
            >
                메인화면으로 이동
            </button>
            <Search currentUser={{ id: userId }} />
            <div className="main-content">
                <Aside
                    currentUser={{ id: userId }}
                    onProjectSelect={(project) => {
                        setSelectedProject(project);
                    }}
                />
                <div className="outlet-content">
                    <Outlet />
                </div>
                <div className="participants">
                    <div className="tab-buttons">
                        <button
                            onClick={() => setActiveTab("friends")}
                            className={activeTab === "friends" ? "active" : ""}
                        >
                            친구 목록
                        </button>
                        <button
                            onClick={() => setActiveTab("participants")}
                            className={activeTab === "participants" ? "active" : ""}
                        >
                            참여자 목록
                        </button>
                        <button
                            onClick={() => setActiveTab("pending")}
                            className={activeTab === "pending" ? "active" : ""}
                        >
                            초대 목록
                        </button>
                    </div>
                    {userRole === "ADMIN" && (
                        <button
                            className="invite-button"
                            onClick={() => {
                                setIsInviteModalOpen(true);
                            }}
                        >
                            초대하기
                        </button>
                    )}
                    <div className="friend-list-modal">{renderList()}</div>
                </div>
            </div>
            <InviteModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                selectedProject={selectedProject}
                userId={userId}
            />
        </div>
    );
};

export default Layout;
