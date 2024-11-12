import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../components/assest/css/ChatRoom.css';

const ChatRoom = () => {
    const { chatRoomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [webSocket, setWebSocket] = useState(null);
    const [senderId, setSenderId] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const chatWindowRef = useRef(null); // 스크롤 위치 조정을 위한 ref

   
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8080/api/user/info', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setSenderId(response.data.id);
                    setUsername(response.data.username);
                } catch (error) {
                    console.error('사용자 정보를 불러오는 중 에러 발생 : ', error);
                }
            }
        };
        fetchUserData();
    }, [chatRoomId]);

    // 메시지를 가져오는 함수
    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/chat/${chatRoomId}/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const formattedMessages = response.data.map(msg => ({
                senderId: msg.senderId,
                message: msg.content,
                time: new Date(msg.createdAt).toLocaleTimeString(),
                sort: msg.senderId === senderId ? 'sent' : 'received',
                username: msg.sender.username 
            }));
            setMessages(formattedMessages);
        } catch (error) {
            console.error("메시지 가져오기 오류:", error);
        }
    };


    useEffect(() => {
        const wsProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";
        const wsURL = `${wsProtocol}localhost:8080/chattingServer/${chatRoomId}`;
        const ws = new WebSocket(wsURL);

        ws.onopen = () => {
            console.log("WebSocket 연결 성공");
            fetchMessages(); // 초기 메시지 로딩
            const initialMessage = 'WebSocket 연결 성공';
            setMessages(prev => [...prev, { type: 'info', message: initialMessage, sort: 'info' }]);
            ws.send(JSON.stringify({ type: 'join', senderId, chatRoomId }));
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const timestamp = new Date().toLocaleTimeString();
            const messageWithSort = {
                ...message,
                time: timestamp,
                sort: message.senderId === senderId ? 'sent' : 'received',
                username: message.sender.username 
            };
            setMessages(prev => [...prev, messageWithSort]);
        };

        ws.onerror = (error) => {
            console.error("WebSocket 오류:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket 연결 종료");
        };

        setWebSocket(ws);

        return () => {
            if (ws) {
                ws.send(JSON.stringify({ type: 'leave', senderId }));
                ws.close();
            }
        };
    }, [chatRoomId, senderId, username]); 

    // 메시지 전송 함수
    const sendMessage = () => {
        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
            const trimmedMessage = messageInput.trim();
            const timestamp = new Date().toLocaleTimeString();
            if (trimmedMessage !== '') {
                const sentMessage = {
                    type: 'sent',
                    message: trimmedMessage,
                    time: timestamp,
                    senderId,
                    sort: 'sent',
                    username: username  
                };
                webSocket.send(JSON.stringify({ type: 'text', senderId, message: trimmedMessage, time: timestamp, chatRoomId }));
                setMessages(prev => [...prev, sentMessage]);
                setMessageInput('');  
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

    // 최신 메시지로 스크롤
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-container">
            <h2>{chatRoomId}번 프로젝트 채팅방</h2>
            <div id="chatWindow" className="chat-window" ref={chatWindowRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sort}`}>
                        <strong>{msg.username}</strong>: {msg.message}<br />
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
            </div>
        </div>
    );
};

export default ChatRoom;