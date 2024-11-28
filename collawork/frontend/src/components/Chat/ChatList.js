import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalPage from './ModalPage'; 
import ChatRoomOne from './ChatRoomOne'; 

const ChatList = ({ userId }) => {
  const [chatList, setChatList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [currentChatRoomId, setCurrentChatRoomId] = useState(null); 


  const fetchChat = async () => {
    if (!userId) {
      console.warn("fetchChat 실행 중단 - userId가 유효하지 않습니다.");
      setErrorMessage("유효하지 않은 사용자 ID입니다."); 
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("API 호출 userId:", userId);

      const response = await axios.get(
        `http://localhost:8080/api/user/chatrooms/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: { userId },
        }
      );

      if (response.status === 204 || response.data.length === 0) {
        setErrorMessage("참여 중인 채팅방이 없습니다.");
        setChatList([]);
      } else {
        console.log("API 응답 데이터:", response.data);
        setChatList(response.data);
        setErrorMessage(""); 
      }
    } catch (error) {
      console.error("채팅방 목록을 불러오는 중 오류 발생:", error);
      setErrorMessage("채팅방 정보를 불러오는 중 오류가 발생했습니다."); 
    }
  };

  const openModal = (chatRoomId) => {
    setCurrentChatRoomId(chatRoomId); 
    setIsModalOpen(true); 
  };

  const closeModal = () => {
    setIsModalOpen(false); 
    setCurrentChatRoomId(null);
  };

  useEffect(() => {
    fetchChat();
  }, [userId]);

  return (
    <div className="chat-list">
      <h3>채팅방 리스트</h3>
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <div>
          {chatList.length > 0 ? (
            chatList.map((chatRoom) => (
              <p
                key={chatRoom.id}
                onClick={() => openModal(chatRoom.id)} // 채팅방 클릭 시 모달 열기
              >
                {chatRoom.roomName}
              </p>
            ))
          ) : (
            <p>참여 중인 채팅방이 없습니다.</p>
          )}
        </div>
      )}
      {isModalOpen && (
        <ModalPage onClose={closeModal}>
          <ChatRoomOne chatRoomId={currentChatRoomId} />
        </ModalPage>
      )}
    </div>
  );
};

export default ChatList;