import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../components/assest/css/ChatRoom.css';

const ChatRoom = () => {
    const { chatRoomId } = useParams();  // URL 파라미터에서 chatRoomId 가져오기
    const [messages, setMessages] = useState([]);  // 채팅 메시지 상태
    const [messageInput, setMessageInput] = useState('');  // 메시지 입력 상태
    const [webSocket, setWebSocket] = useState(null);  // WebSocket 상태
    const [senderId, setSenderId] = useState('');  // 보낸 사람 ID 상태
    const [username,setUsername] =useState('');
    const navigate = useNavigate();

    // 유저 정보 가져오기
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8080/api/user/info', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setSenderId(response.data.id);
                    setUsername(response.data.username);
                } catch (error) {
                    console.error('사용자 정보를 불러오는 중 에러 발생 : ', error);
                }
            }
        };
        fetchUserData();
    }, []);

    // 채팅방 메시지 가져오기
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/chat/${chatRoomId}/messages`);
                setMessages(response.data);
            } catch (error) {
                console.error("메시지 가져오기 오류:", error);
            }
        };
        fetchMessages();
    }, [chatRoomId]);

    // WebSocket 연결 설정
    useEffect(() => {
        const wsProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";
        const wsURL = `${wsProtocol}localhost:8080/chattingServer/${chatRoomId}`;
        const ws = new WebSocket(wsURL);

        ws.onopen = () => {
            console.log("WebSocket 연결 성공");
            const initialMessage = 'WebSocket 연결 성공';
            setMessages(prev => [...prev, { type: 'info', message: initialMessage }]);
            ws.send(JSON.stringify({ type: 'join', senderId, chatRoomId }));
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const timestamp = new Date().toLocaleTimeString();
            setMessages(prev => [...prev, { ...message, time: timestamp }]);
        };

        ws.onerror = (error) => {
            console.error("WebSocket 오류:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket 연결 종료");
        };

        setWebSocket(ws);

        // 컴포넌트 언마운트 시 WebSocket 종료
        return () => {
            if (ws) {
                ws.send(JSON.stringify({ type: 'leave', senderId }));
                ws.close();
            }
        };
    }, [chatRoomId, senderId]);

    // 페이지가 새로고침될 때 `sessionStorage`에서 메시지 가져오기
    useEffect(() => {
        const savedMessages = JSON.parse(sessionStorage.getItem(chatRoomId)) || [];
        setMessages(savedMessages);
    }, [chatRoomId]);

    // 메시지 전송 함수
    const sendMessage = () => {
        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
            const trimmedMessage = messageInput.trim();
            const timestamp = new Date().toLocaleTimeString();
            if (trimmedMessage !== '') {
                webSocket.send(JSON.stringify({ type: 'text', senderId, message: trimmedMessage, time: timestamp ,chatRoomId:chatRoomId}));

                setMessages(prev => [...prev, { type: 'sent', message: trimmedMessage, time: timestamp, senderId }]);

                // `sessionStorage`에 메시지 저장
                const savedMessages = JSON.parse(sessionStorage.getItem(chatRoomId)) || [];
                savedMessages.push({ senderId, message: trimmedMessage, time: timestamp });
                sessionStorage.setItem(chatRoomId, JSON.stringify(savedMessages));

                setMessageInput('');  // 입력창 초기화
            }
        } else {
            console.log("웹소켓이 연결되지 않았습니다.");
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const handlerBackToMain = () => {
        navigate("/");
    };

    const handleCloseWebSocket = () => {
        if (webSocket) {
            webSocket.send(JSON.stringify({ type: 'leave', senderId }));
            webSocket.close();
            setWebSocket(null);
            console.log('웹소켓이 종료되었습니다.');
        }
    };

    return (
        <div className="chat-container">
            <h2>{chatRoomId}번 프로젝트 채팅방</h2>
            <div id="chatWindow" className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.type}`}>
                        {msg.message}<br />
                        <span>{msg.time}</span>
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    id="chatMessage"
                    placeholder="메시지 입력"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button id="sendBtn" onClick={sendMessage}>전송</button>
                <button onClick={handlerBackToMain}>메인으로 돌아가기</button>
                <button onClick={handleCloseWebSocket}>웹소켓 종료</button>
            </div>
        </div>
    );
};

export default ChatRoom;