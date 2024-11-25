import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../components/assest/css/ChatRoom.css';
import {projectStore} from '../../store';


const ChatRoom = () => {
 //   const { chatRoomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [fileInput, setFileInput] = useState(null);
    const [webSocket, setWebSocket] = useState(null);
    const [senderId, setSenderId] = useState('');
    const [username, setUsername] = useState('');
    const [roomName, setRoomName] = useState('');
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();
    const chatWindowRef = useRef(null);

   
   const projectData = projectStore((state) => state.projectData);
     const chatRoomId =  projectData.chatRoomId
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('토큰이 존재하지 않습니다. 로그인 후 다시 시도하세요.');
                return;
            }
    
            try {
                
                const response = await axios.get('http://localhost:8080/api/user/info', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
    
                if (response.data) {
                    setSenderId(response.data.id || null);
                    setUsername(response.data.username || '알 수 없음');
                } else {
                    console.error('서버로부터 사용자 정보를 가져오지 못했습니다.');
                }
            } catch (error) {
                console.error('사용자 정보를 불러오는 중 에러 발생:', error);
            }
        };
    
        fetchUserData();
    }, [chatRoomId]);
    

    useEffect(() => {
        const wsProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";
        const wsURL = `${wsProtocol}localhost:8080/chattingServer/${chatRoomId}`;
        const ws = new WebSocket(wsURL);

        ws.onopen = () => {
            console.log("WebSocket 연결 성공");
            fetchMessages();
            ws.send(JSON.stringify({ type: 'join', senderId, chatRoomId }));
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const timestamp = new Date().toLocaleTimeString();
            const messageWithSort = {
                ...message,
                time: timestamp,
                sort: message.senderId === senderId ? 'sent' : 'received',
                username: message.sender.username,
                fileUrl: message.fileUrl || '',
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

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/chat/${chatRoomId}/messages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const formattedMessages = response.data.map(msg => ({
                messageId: msg.id,
                senderId: msg.senderId,
                message: msg.content,
                time: new Date(msg.createdAt).toLocaleTimeString(),
                sort: msg.senderId === senderId ? 'sent' : 'received',
                username: msg.sender.username,
                type: msg.messageType,
                fileUrl: msg.fileUrl || ''
            }));
            setMessages(formattedMessages);
        } catch (error) {
            console.error("메시지 가져오기 오류:", error);
        }
    };

    useEffect(() => {
        const fetchRoomName = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/chat/roomName/${chatRoomId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setRoomName(response.data);
            } catch (error) {
                console.error("채팅방 이름 가져오기 오류:", error);
            }
        };
        fetchRoomName();
    }, [chatRoomId]);

    // 체크 풀기
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!event.target.closest('.message') && !event.target.closest('.dropdown-menu')) {
                handleCancelDelete();
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);
        // 메세지 전송
    const sendMessage = async (type = 'text') => {
        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
            const timestamp = new Date().toLocaleTimeString();
            if (type === 'text' && messageInput.trim() !== '') {
                const sentMessage = {
                    senderId,
                    chatRoomId,
                    message: messageInput,
                    messageType: 'text',
                    fileUrl: '',
                    time: timestamp,
                    sort: 'sent',
                    username
                };


                webSocket.send(JSON.stringify(sentMessage));
                setMessages(prev => [...prev, sentMessage]);
                setMessageInput('');
                fetchMessages();


            } else if (type === 'file' && fileInput) {
                const formData = new FormData();
                formData.append('file', fileInput);
                formData.append('senderId', senderId);
                formData.append('chatRoomId', chatRoomId);
                formData.append('timestamp', timestamp);

                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.post('http://localhost:8080/api/chat/upload', formData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    const fileUrl = response.data.fileUrl;
                    const sentMessage = {
                        type: 'file',
                        fileUrl: fileUrl,
                        time: timestamp,
                        senderId,
                        sort: 'sent',
                        username
                    };

                    webSocket.send(JSON.stringify({ type, senderId, fileUrl, chatRoomId }));
                    setMessages(prev => [...prev, sentMessage]);
                    setFileInput(null);
                    fetchMessages();

                } catch (error) {
                    console.error('파일 업로드 오류:', error);
                }
            }
        } else {
            console.log("웹소켓이 연결되지 않았습니다.");
        }
    };
        // 엔터
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const handleFileChange = (event) => {
        setFileInput(event.target.files[0]);
    };

    const handlerBackToMain = () => {
        navigate("/main");
    };
        //채팅창 스크롤 맨아래로 
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    // 메세지 삭제 
    const deleteSelectedMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/chat/deleteMessages`, {
                headers: { 'Authorization': `Bearer ${token}` },
                data: { messageIds: selectedMessages }
            });
            setMessages((prevMessages) => prevMessages.filter((msg) => !selectedMessages.includes(msg.messageId)));
            setSelectedMessages([]);
            setIsDeleteMode(false);
        } catch (error) {
            console.error("메시지 삭제 오류:", error);
        }
    };
        //우클릭 시
    const rightClick = (event, messageId) => {
        event.preventDefault();
        setDropdownVisible(true);
        setDropdownPosition({ x: event.clientX, y: event.clientY });
    };
        // 우클릭 후 드랍
    const handleDropdownSelect = (action) => {
        if (action === 'delete') {
            setIsDeleteMode(true);
        }
        setDropdownVisible(false);
    };
        // 우클릭 후 체크박스 클릭
    const handleCheckboxChange = (messageId) => {
        setSelectedMessages((prevSelected) =>
            prevSelected.includes(messageId)
                ? prevSelected.filter((id) => id !== messageId)
                : [...prevSelected, messageId]
        );
    };
            // 삭제 모드 해제 
    const handleCancelDelete = () => {
        setSelectedMessages([]);  
        setIsDeleteMode(false);    
    };

    return (
        <div className="chat-container">
            <h2>{roomName}</h2>
            <div id="chatWindow" className="chat-window" ref={chatWindowRef}>
                {messages.map((msg) => (
                    <div key={msg.messageId} className={`message ${msg.sort}`} onContextMenu={(e) => rightClick(e,msg.messageId)}>
                         {isDeleteMode && (
                            <input
                                type="checkbox"
                                checked={selectedMessages.includes(msg.messageId)}
                                onChange={() => handleCheckboxChange(msg.messageId)}
                            />
                        )}
                        <strong>{msg.username}</strong>: 
                        {msg.type === 'file' ? (
                            msg.fileUrl.match(/\.(jpeg|jpg|gif|png|bmp|svg|img|jfif)$/i) ? (
                                <img src={msg.fileUrl} alt="이미지 미리보기" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                            ) : (
                                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" download={`file_${msg.senderId}_${msg.username}`}>{msg.fileUrl}</a>
                            )
                        ) : (
                            msg.message 
                        )}
                        <br />
                        <span>{msg.time}</span>
                    </div>
                ))}
                       {dropdownVisible && (
                    <ul
                        className="dropdown-menu"
                        style={{ top: dropdownPosition.y, left: dropdownPosition.x }}
                    >
                        <li onClick={() => handleDropdownSelect('delete')}>삭제</li>
                    </ul>
                )}
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
                <input type="file" onChange={handleFileChange} />
                <button className="sendBtn" onClick={() => sendMessage('text')}>전송</button>
                <button className="sendBtn" onClick={() => sendMessage('file')}>파일 전송</button>
                {isDeleteMode && <button onClick={deleteSelectedMessages}>선택 삭제</button>}
                <button className="back-to-main-button" onClick={handlerBackToMain}>메인으로 돌아가기</button>
            </div>
        </div>
    );
};

export default ChatRoom;