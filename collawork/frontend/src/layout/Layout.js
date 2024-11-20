import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Aside from "../components/Aside";
import Search from "../pages/Search";
import FriendList from "../components/Friend/FriendList";
import PendingInvitations from "../components/project/PendingInvitations";
import axios from "axios";
import "../components/assest/css/Layout.css";
import { useUser } from "../context/UserContext";
import {stateValue} from "../store";

const Layout = () => {
    const { userId } = useUser();
    const [activeTab, setActiveTab] = useState("friends");
    const [participants, setParticipants] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null); 
    const {setHomeShow,setChatShow, setCalShow,setNotiShow,setVotig} = stateValue();

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchAcceptedParticipants = async () => {
        console.log("fetchAcceptedParticipants 호출함");
        console.log("현재 selectedProject:", selectedProject);

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
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("API 응답 데이터:", response.data);

            const formattedParticipants = response.data.map((participant) => ({
                name: participant.username || "이름 없음",
                email: participant.email || "이메일 없음",
            }));

            setParticipants(formattedParticipants);
        } catch (error) {
            console.error("참여자 목록을 가져오는 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        console.log("activeTab 상태:", activeTab);
        if (activeTab === "participants") {
            fetchAcceptedParticipants();
        }
    }, [activeTab]);

    useEffect(() => {
        if (selectedProject && activeTab === "participants") {
            fetchAcceptedParticipants();
        }
    }, [selectedProject]);

    const renderList = () => {
        if (!userId) {
            console.warn("userId가 아직 초기화되지 않았습니다.");
            return <p>로딩 중...</p>;
        }

        if (activeTab === "friends") {
            return <FriendList userId={userId} />;
        } else if (activeTab === "participants") {
            if (participants.length === 0) {
                return <p>참여자가 없습니다.</p>;
            }

            return (
                <ul>
                    {participants.map((participant, index) => (
                        <li key={index}>
                            <strong>{participant.name}</strong> - {participant.email}
                        </li>
                    ))}
                </ul>
            );
        } else if (activeTab === "pending") {
            return (
                <PendingInvitations
                    projectId={selectedProject ? selectedProject.id : null}
                    onInvitationChange={fetchAcceptedParticipants}
                />
            );
        }
    };

    // const onClickHandler = () => {
    //     setHomeShow(''),
    //     setChatShow(''),
    //     setCalShow(''),
    //     setNotiShow(''),
    //     setVotig('')
    // }

    return (
        <div className="layout-container">
            <Search currentUser={{ id: userId }} />
                <div className="main-content">
                    {/* <button onClick={onClickHandler}>홈</button> */}
                    <Aside
                    currentUser={{ id: userId }}
                    onProjectSelect={(project) => {
                        console.log("선택된 프로젝트 업데이트:", project);
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
                    <div className="friend-list-modal">{renderList()}</div>
                </div>
            </div>
        </div>
    );
};

export default Layout;

