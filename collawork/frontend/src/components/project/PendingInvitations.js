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

            console.log("Pending Invitations Response:", response.data);

            // API 응답 데이터 구조에 따라 처리
            setPendingInvitations(
                response.data.map((invitation) => ({
                    userId: invitation.user?.id,
                    username: invitation.user?.username || "알 수 없음",
                    email: invitation.user?.email || "이메일 없음",
                }))
            );
        } catch (error) {
            console.error("프로젝트 초대 목록 오류 :", error);
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
            onInvitationChange(); // 부모 컴포넌트 상태 갱신
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
            alert("참가 요청이 거절되었습니다.");
            fetchPendingInvitations(); // 갱신된 목록 다시 가져오기
            onInvitationChange(); // 부모 컴포넌트 상태 갱신
        } catch (error) {
            console.error("프로젝트 초대 거절 오류 : ", error);
            alert("거절 중 문제가 발생했습니다.");
        }
    };

    return (
        <div>
            <h3>대기 중인 초대</h3>
            {pendingInvitations.length === 0 ? (
                <p>대기 중인 초대가 없습니다.</p>
            ) : (
                <ul>
                    {pendingInvitations.map((invitation) => (
                        <li key={invitation.userId}>
                            <strong>{invitation.username}</strong> ({invitation.email})
                            <button onClick={() => handleAccept(invitation.userId)}>승인</button>
                            <button onClick={() => handleReject(invitation.userId)}>거절</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PendingInvitations;
