import React, { useState, useEffect } from "react";
import "../components/assest/css/InviteModal.css";
import axios from "axios";

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

  const [friendsPage, setFriendsPage] = useState(1);
  const [invitesPage, setInvitesPage] = useState(1);
  const [participantsPage, setParticipantsPage] = useState(1);
  const pageSize = 5; // 한 페이지당 항목 수

  const API_URL = process.env.REACT_APP_API_URL;

  // 페이징 데이터 추출
  const paginate = (data, page) => data.slice((page - 1) * pageSize, page * pageSize);

  const paginatedFriends = paginate(friends, friendsPage);
  const paginatedInvites = paginate(invites, invitesPage);
  const paginatedParticipants = paginate(participants, participantsPage);

  // 친구 목록 불러오기
  const fetchFriends = async () => {
    if (!userId) {
      console.warn("fetchFriends 실행 중단 - userId가 유효하지 않습니다.");
      return;
    }

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
      console.error("친구 목록을 불러오는 중 오류 발생:", error);
    }
  };

  // 참여자 목록 불러오기
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
      console.error("참여자 목록을 불러오는 중 오류 발생:", error);
    }
  };

  // 초대 발송
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
      const participantIds = invites.map((invite) => invite.id); // 초대 대상 ID
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/api/user/projects/${selectedProject.id}/participants/invite`,
        { participants: participantIds },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      alert(response.data);
      onClose();
    } catch (error) {
      if (error.response && error.response.data.includes("이미 참여 중")) {
        setWarningMessage(error.response.data);
      } else {
        alert("초대에 실패했습니다.");
      }
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-invite" onClick={(e) => e.target.className === "modal-overlay-invite" && onClose()}>
      <div className="invite-modal-content">
        <h3>{selectedProject?.name || "프로젝트"}에 초대하기</h3>
        <div className="participants-section">
          {/* 친구 목록 */}
          <div className="friends-list">
            <h4>
              친구 목록
              <input
                type="checkbox"
                checked={isAllFriendsSelected}
                onChange={() => {
                  setIsAllFriendsSelected(!isAllFriendsSelected);
                  setSelectedFriends(isAllFriendsSelected ? [] : [...friends]);
                }}
              />
            </h4>
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
            {/* 친구 목록 페이징 */}
            <div className="pagination-controls">
              <button disabled={friendsPage === 1} onClick={() => setFriendsPage(friendsPage - 1)}>{"<"}</button>
              <span>{friendsPage}</span>
              <button
                disabled={friendsPage === Math.ceil(friends.length / pageSize)}
                onClick={() => setFriendsPage(friendsPage + 1)}
              >
                {">"}
              </button>
            </div>
          </div>

          {/* 버튼 */}
          <div className="actions">
            <button onClick={addParticipants}>{'>>'}</button>
            <button onClick={removeParticipants}>{'<<'}</button>
          </div>

          {/* 초대 목록 */}
        <div className="invites-list">
        <h4>
            초대 목록
            <input
            type="checkbox"
            checked={isAllInvitesSelected}
            onChange={() => {
                setIsAllInvitesSelected(!isAllInvitesSelected);
                setSelectedInvites(isAllInvitesSelected ? [] : [...invites]);
            }}
            />
        </h4>
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
        {/* 초대 목록 페이징 */}
        <div className="pagination-controls">
            <button disabled={invitesPage === 1} onClick={() => setInvitesPage(invitesPage - 1)}>{"<"}</button>
            <span>{invitesPage}</span>
            <button
            disabled={invitesPage === Math.ceil(invites.length / pageSize)}
            onClick={() => setInvitesPage(invitesPage + 1)}
            >
            {">"}
            </button>
        </div>
        </div>
          {/* 참여자 목록 */}
          <div className="participants-list">
            <h4>참여자 목록</h4>
            <ul>
              {paginatedParticipants.map((participant) => (
                <li key={participant.id}>
                  {participant.username} ({participant.email})
                </li>
              ))}
            </ul>
            {/* 참여자 목록 페이징 */}
            <div className="pagination-controls">
              <button
                disabled={participantsPage === 1}
                onClick={() => setParticipantsPage(participantsPage - 1)}
              >
                {"<"}
              </button>
              <span>{participantsPage}</span>
              <button
                disabled={participantsPage === Math.ceil(participants.length / pageSize)}
                onClick={() => setParticipantsPage(participantsPage + 1)}
              >
                {">"}
              </button>
            </div>
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
