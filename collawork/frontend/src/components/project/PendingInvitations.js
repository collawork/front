import { useState, useEffect } from "react";
import axios from "axios";

const PendingInvitations = ({ projectId, onInvitationChange }) => {
    const [pendingInvitations, setPendingInvitations] = useState([]);

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchPendingInvitations();
    }, [projectId]);

    const fetchPendingInvitations = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${API_URL}/api/user/projects/${projectId}/participants/pending`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPendingInvitations(response.data);
        } catch (error) {
            console.error("프로젝트 초대 오류 :", error);
        }
    };

    const handleAccept = async (userId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                `${API_URL}/api/user/projects/${projectId}/participants/${userId}/accept`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("참가 요청이 승인되었습니다.");
            fetchPendingInvitations(); // 갱신된 목록 다시 가져오기
        } catch (error) {
            console.error("참가 요청 승인 오류:", error);
            alert("승인 중 문제가 발생했습니다.");
        }
    };

    const handleReject = async (userId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                `${API_URL}/api/user/projects/${projectId}/participants/${userId}/reject`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onInvitationChange(); // 부모 컴포넌트에서 전달된 갱신 콜백
        } catch (error) {
            console.error("프로젝트 초대 거절 오류 : ", error);
        }
    };

    return (
        <div>
            <h3>대기 중인 초대</h3>
            <ul>
                {pendingInvitations.map((invitation) => (
                    <li key={invitation.userId}>
                        {invitation.username} ({invitation.email})
                        <button onClick={() => handleAccept(invitation.userId)}>승인</button>
                        <button onClick={() => handleReject(invitation.userId)}>거절</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PendingInvitations;
