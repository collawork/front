import React, { useEffect, useState } from "react";
import axios from "axios";

const PendingInvitations = ({ projectId, onInvitationChange }) => {
    const [invitations, setInvitations] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchPendingInvitations = async () => {
            if (!projectId) {
                console.warn("Project ID가 없습니다.");
                return;
            }

            const token = localStorage.getItem("token");
            if (!token) {
                console.error("토큰이 없습니다.");
                return;
            }

            try {
                const response = await axios.get(
                    `${API_URL}/api/user/projects/${projectId}/participants/pending`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("Pending Invitations Response:", response.data);

                const formattedInvitations = response.data.map((invitation) => ({
                    name: invitation.username || "알 수 없음",
                    email: invitation.email || "이메일 없음",
                }));

                setInvitations(formattedInvitations);
            } catch (error) {
                console.error("초대 목록을 가져오는 중 오류 발생:", error);
            }
        };

        fetchPendingInvitations();
    }, [projectId]);

    // const handleAccept = async (invitation) => {
    //     // 승인 처리
    //     console.log("승인 요청:", invitation);
    //     onInvitationChange(); // 상태 변경 후 목록 갱신
    // };

    // const handleReject = async (invitation) => {
    //     // 거절 처리
    //     console.log("거절 요청:", invitation);
    //     onInvitationChange(); // 상태 변경 후 목록 갱신
    // };

    return (
        <div>
            <h3>대기 중인 초대</h3>
            {invitations.length > 0 ? (
                <ul>
                    {invitations.map((invitation, index) => (
                        <li key={index}>
                            {invitation.name} ({invitation.email}){" "}
                            {/* <button onClick={() => handleAccept(invitation)}>승인</button>
                            <button onClick={() => handleReject(invitation)}>거절</button>                  초대 목록에 승인 거절 있어야 되나 ?*/}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>대기 중인 초대가 없습니다.</p>
            )}
        </div>
    );
};

export default PendingInvitations;
