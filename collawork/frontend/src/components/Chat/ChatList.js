import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChatList = ({userId})=>{
    const [chatList,setChatList] =  useState([]);
    
const navigate = useNavigate();

    // 채팅 목록 불러오기
    const fetchChat = async () => {
        if (!userId) {
            console.warn("fetchChat 실행 중단 - userId가 유효하지 않습니다.");
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            console.log("API 호출 userId:", userId);
    
            const response = await axios.get(`http://localhost:8080/api/user/chatrooms/list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: { userId }, 
            });
    
            console.log("API 응답 데이터:", response.data);
            setChatList(response.data); 
            console.log("채팅방 리스트"+chatList);
            console.log(chatList);

        } catch (error) {
            console.error('채팅방 목록을 불러오는 중 오류 발생:', error);
        }
    };
    useEffect(() => {
        fetchChat();
    }, [userId]);
    
    


    return (
        <div className="chat-list">
          <h3>채팅방 리스트</h3>
          <div>
            {chatList.map((chatRoom) => (
              <p key={chatRoom.id} onClick={() =>  navigate(`/chattingServer/${chatRoom.id}`)}>
                {chatRoom.roomName}
              </p>
            ))}
          </div>
        </div>
      );
};
export default ChatList;