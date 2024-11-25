import React, { useState, useEffect } from "react";
import "../components/assest/css/InviteModal.css";
import axios from "axios";
import Pagination from "../components/Pagination";

const InviteModal = ({
  isOpen,
  onClose,
  selectedProject,
  userId,
}) => {
  const [friends, setFriends] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [invites, setInvites] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedInvites, setSelectedInvites] = useState([]);
  const [isAllFriendsSelected, setIsAllFriendsSelected] = useState(false);
  const [isAllInvitesSelected, setIsAllInvitesSelected] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  // 페이징 상태
  const [friendsCurrentPage, setFriendsCurrentPage] = useState(1);
  const [invitesCurrentPage, setInvitesCurrentPage] = useState(1);
  const pageSize = 5; // 한 페이지당 표시할 항목 수

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchFriends = async () => {
    if (!userId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/friends/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: { userId },
      });

      const filteredFriends = response.data
        .filter(friend => friend.status === "ACCEPTED")
        .map(friend => {
          if (friend.requester && String(friend.requester.id) === String(userId)) {
            return {
              id: friend.responder.id,
              username: friend.responder.username,
              email: friend.responder.email,
            };
          } else if (friend.responder && String(friend.responder.id) === String(userId)) {
            return {
              id: friend.requester.id,
              username: friend.requester.username,
              email: friend.requester.email,
            };
          }
          return null;
        })
        .filter(Boolean);

      setFriends(filteredFriends);
    } catch (error) {
      console.error("친구 목록 불러오기 오류:", error);
    }
  };

  const fetchAcceptedParticipants = async () => {
    if (!selectedProject || !selectedProject.id) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/user/projects/${selectedProject.id}/participants/accepted`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setParticipants(response.data);
    } catch (error) {
      console.error("참여자 목록 불러오기 오류:", error);
    }
  };

  const handleInvite = async () => {
    if (!selectedProject || !selectedProject.id) {
      alert("프로젝트를 선택해주세요.");
      return;
    }
    if (invites.length === 0) {
      alert("초대할 사용자가 없습니다.");
      return;
    }

    try {
      const participantIds = invites.map((invite) => invite.id);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/user/projects/${selectedProject.id}/participants/invite`,
        { participants: participantIds },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      alert(response.data); // 초대 성공 알림
      onClose();
    } catch (error) {
      console.error("초대 요청 오류:", error.response?.data || error.message);
      alert("초대 실패");
    }
  };

  const addParticipants = () => {
    const validFriends = selectedFriends.filter(
      (friend) => !participants.some((participant) => participant.id === friend.id)
    );

    if (validFriends.length !== selectedFriends.length) {
      setWarningMessage("이미 참여자 목록에 있는 사용자는 추가할 수 없습니다.");
    }

    setInvites((prev) => [...prev, ...validFriends]);
    setFriends((prev) => prev.filter((friend) => !validFriends.includes(friend)));
    setSelectedFriends([]);
    setIsAllFriendsSelected(false);
  };

  const removeParticipants = () => {
    setFriends((prev) => [...prev, ...selectedInvites]);
    setInvites((prev) => prev.filter((invite) => !selectedInvites.includes(invite)));
    setSelectedInvites([]);
    setIsAllInvitesSelected(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchAcceptedParticipants();
      fetchFriends();
      setInvites([]);
      setSelectedFriends([]);
      setSelectedInvites([]);
      setWarningMessage("");
    }
  }, [isOpen]);

  // 페이징 데이터
  const paginatedFriends = friends.slice(
    (friendsCurrentPage - 1) * pageSize,
    friendsCurrentPage * pageSize
  );
  const paginatedInvites = invites.slice(
    (invitesCurrentPage - 1) * pageSize,
    invitesCurrentPage * pageSize
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && onClose()}>
      <div className="modal-content">
        <h3>{selectedProject?.name || "프로젝트"}에 초대하기</h3>
        <div className="participants-section">
          <div className="friends-list">
            <h4>친구 목록</h4>
            <ul>
              {paginatedFriends.map((friend) => (
                <li key={friend.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFriends.includes(friend)}
                      onChange={() =>
                        setSelectedFriends((prev) =>
                          prev.includes(friend)
                            ? prev.filter((f) => f !== friend)
                            : [...prev, friend]
                        )
                      }
                    />
                    {friend.username} ({friend.email})
                  </label>
                </li>
              ))}
            </ul>
            <Pagination
              currentPage={friendsCurrentPage}
              totalPages={Math.ceil(friends.length / pageSize)}
              onPageChange={setFriendsCurrentPage}
            />
          </div>

          <div className="actions">
            <button onClick={addParticipants}>{'>>'}</button>
            <button onClick={removeParticipants}>{'<<'}</button>
          </div>

          <div className="invites-list">
            <h4>초대 목록</h4>
            <ul>
              {paginatedInvites.map((invite) => (
                <li key={invite.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedInvites.includes(invite)}
                      onChange={() =>
                        setSelectedInvites((prev) =>
                          prev.includes(invite)
                            ? prev.filter((i) => i !== invite)
                            : [...prev, invite]
                        )
                      }
                    />
                    {invite.username} ({invite.email})
                  </label>
                </li>
              ))}
            </ul>
            <Pagination
              currentPage={invitesCurrentPage}
              totalPages={Math.ceil(invites.length / pageSize)}
              onPageChange={setInvitesCurrentPage}
            />
          </div>
        </div>

        {warningMessage && <p className="warning-message">{warningMessage}</p>}

        <div className="modal-actions">
          <button onClick={handleInvite}>초대하기</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
