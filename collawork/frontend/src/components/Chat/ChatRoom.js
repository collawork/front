import React, { useEffect, useState } from 'react';
import WebSocket from 'isomorphic-ws';

const ChatRoom = ({ chatRoomId }) => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [file, setFile] = useState(null);
    const [messageContent, setMessageContent] = useState('');

    const url = process.env.REACT_APP_API_URL; // 환경 변수에서 API URL 가져오기

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8080/chat/${chatRoomId}`);
        setSocket(ws);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        return () => {
            ws.close();
        };
    }, [chatRoomId]);

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetch(`${url}/messages/${chatRoomId}`); // 수정된 API URL
            const data = await response.json();
            setMessages(data);
        };

        fetchMessages();
    }, [chatRoomId, url]); // url 추가 의존성

    const handleSendMessage = async () => {
        const newMessage = {
            content: messageContent,
            senderId: 'currentUserId', // 현재 사용자 ID로 변경
            chatRoomId,
            messageType: file ? 'file' : 'text', // 파일 여부에 따라 메시지 유형 설정
            fileUrl: file ? await uploadFile(file) : null, // 파일 업로드 후 URL 받아오기
            createdAt: new Date().toISOString(),
        };

        await fetch(`${url}/messages`, { // 수정된 API URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMessage),
        });
        socket.send(JSON.stringify(newMessage)); // 웹소켓으로 메시지 전송

        // 초기화
        setMessageContent('');
        setFile(null);
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${url}/upload`, { // 수정된 API URL
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.text(); // 파일 업로드 성공 시 URL 반환
            return result; // URL 반환 
        }
        return null;
    };

    return (
        <div>
            <div>
                {messages.map((msg) => (
                    <div key={msg.id}>
                        <strong>{msg.senderId}:</strong> {msg.content} <em>{new Date(msg.createdAt).toLocaleString()}</em>
                        {msg.fileUrl && (
                            <div>
                                <a href={`/${msg.fileUrl}`} target="_blank" rel="noopener noreferrer">
                                    파일 다운로드
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div>
                <input 
                    type="text" 
                    value={messageContent} 
                    onChange={(e) => setMessageContent(e.target.value)} 
                    placeholder="메시지를 입력하세요"
                />
                <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files[0])} 
                />
                <button onClick={handleSendMessage}>보내기</button>
            </div>
        </div>
    );
};

export default ChatRoom;