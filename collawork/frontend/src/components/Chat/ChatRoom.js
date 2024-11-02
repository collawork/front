import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api'; // 설정된 axios 인스턴스 import

const ChatRoom = () => {
  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [webSocket, setWebSocket] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await api.get('/auth/userinfo');
        setUserId(response.data.userId);
      } catch (error) {
        console.error("사용자 정보를 가져오는데 실패했습니다.", error);
        navigate('/login');
      }
    };

    fetchUserId();
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    const wsProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";
    const wsURL = `${wsProtocol}localhost:8080/chattingServer`;
    const ws = new WebSocket(wsURL);

    ws.onopen = () => {
      console.log("webSocket 연결 성공");
      ws.send(JSON.stringify({ type: 'join', userId }));
    };

    ws.onmessage = (event) => {
      console.log("서버로부터 메세지 수신: " + event.data);
      try {
        const parsedMessage = JSON.parse(event.data);
        setMessages(prev => [...prev, parsedMessage]);
      } catch (error) {
        console.error("메시지 파싱 오류: ", error);
      }
    };

    ws.onclose = () => {
      console.log("서버 연결 종료");
    };

    ws.onerror = (error) => {
      console.error("웹소켓 에러: ", error);
    };

    setWebSocket(ws);

    return () => {
      if (ws) {
        ws.send(JSON.stringify({ type: 'leave', userId }));
        ws.close();
      }
    };
  }, [userId]);

  const sendMessage = () => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      const trimmedMessage = messageInput.trim();
      if (trimmedMessage) {
        webSocket.send(JSON.stringify({ type: 'message', userId, content: trimmedMessage }));
        setMessageInput('');
      }
    }
  };

  const sendFile = () => {
    if (fileInput && webSocket && webSocket.readyState === WebSocket.OPEN) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        webSocket.send(arrayBuffer);
      };
      reader.readAsArrayBuffer(fileInput);
      setFileInput(null);
    }
  };

  return (
    <>
      <div className="chat-container">
        <h2>웹소켓 채팅</h2>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              <strong>{msg.senderId}</strong>: {msg.content}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
        />
        <input
          type="file"
          onChange={e => setFileInput(e.target.files[0])}
        />
        <button onClick={sendMessage}>전송</button>
        <button onClick={sendFile}>파일 전송</button>
      </div>
    </>
  );
};

export default ChatRoom;