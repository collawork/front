// import React, { useEffect, useState } from 'react';
// import WebSocket from 'isomorphic-ws';
// import { useParams, useNavigate } from 'react-router-dom';

// const ChatRoom = () => {
//     const { chatRoomId } = useParams(); // URL에서 chatRoomId 가져오기
//     const [messages, setMessages] = useState([]); // 채팅 메시지 상태 관리
//     const [messageContent, setMessageContent] = useState(''); // 입력된 메시지 상태 관리
//     const [file, setFile] = useState(null); // 파일 상태 관리
//     const [webSocket, setWebSocket] = useState(null); // 웹소켓 상태 관리
//     const navigate = useNavigate();


//     const url = process.env.REACT_APP_API_URL; // 환경 변수에서 API URL 가져오기

//     useEffect(() => {
//         const wsProtocol = window.location.protocol === "http:" ? "wss://" : "ws://";
//         const wsURL = `${wsProtocol}localhost:8080/chattingServer/${chatRoomId}`;
//         const ws = new WebSocket(wsURL);

//         ws.onopen = () => {
//             console.log("WebSocket 연결 성공");
//             ws.send(JSON.stringify({ type: 'join', chatRoomId }));
//         };

//         ws.onmessage = (event) => {
//             const message = JSON.parse(event.data);
//             setMessages((prevMessages) => [...prevMessages, message]);
//             console.log("받은 메시지:", message); // 메시지 수신 로그
//         };

//         ws.onerror = (error) => {
//             console.error("WebSocket 오류:", error); // 오류 로그
//         };

//         ws.onclose = () => {
//             console.log("WebSocket 연결 종료 2222");
//         };
//                 //연결된 웹소켓인스턴스 관리
//         setWebSocket(ws);

//         return () => {
//             if (ws) {
//                 ws.send(JSON.stringify({ type: 'leave', chatRoomId }));
//                 ws.close();
//             }
//         };
//     }, [chatRoomId]);

//     const handleSendMessage = async () => {
//         if (!messageContent.trim()) return; // 메시지가 비어있으면 전송하지 않음

//         const newMessage = {
//             content: messageContent,
//             senderId: 'currentUserId', // 현재 사용자 ID로 변경
//             chatRoomId,
//             messageType: file ? 'file' : 'text', // 파일 여부에 따라 메시지 유형 설정
//             fileUrl: file ? await uploadFile(file) : null, // 파일 업로드 후 URL 받아오기
//             createdAt: new Date().toISOString(),
//         };

//         if (file && !newMessage.fileUrl) {
//             console.error("파일 업로드 실패"); // 파일 업로드 실패 로그
//             return;
//         }

//         await fetch(`${url}/messages`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(newMessage),
//         });

//         webSocket.send(JSON.stringify(newMessage)); // 웹소켓으로 메시지 전송

//         // 초기화
//         setMessageContent('');
//         setFile(null);
//     };

//     const uploadFile = async (file) => {
//         const formData = new FormData();
//         formData.append('file', file);

//         const response = await fetch(`${url}/upload`, {
//             method: 'POST',
//             body: formData,
//         });

//         if (response.ok) {
//             const result = await response.text(); // 파일 업로드 성공 시 URL 반환
//             return result; // URL 반환
//         }
//         return null;
//     };

//     const handleKeyPress = (event) => {
//         if (event.key === 'Enter') {
//             handleSendMessage();
//         }
//     };

//     const handleBackToMain = () => {
//         navigate("/"); // 메인으로 돌아가기
//     };

//     return (
//         <div className="chat-container">
//             <h2>채팅</h2>
//                 {messages.map((msg, index) => (
//                     <div key={index} style={{ marginTop: '5px' }}>
//                         <strong>{msg.senderId}:</strong> {msg.content} <em>{new Date(msg.createdAt).toLocaleString()}</em>
//                         {msg.fileUrl && (
//                             <div>
//                                 <a href={`/${msg.fileUrl}`} target="_blank" rel="noopener noreferrer">
//                                     파일 다운로드
//                                 </a>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             <div className="input-container" style={{ marginTop: '10px' }}>
//                 <input
//                     type="text"
//                     placeholder="메시지 입력"
//                     value={messageContent}
//                     onChange={e => setMessageContent(e.target.value)}
//                     onKeyDown={handleKeyPress} // Enter 키 입력 처리
//                     style={{
//                         width: '100%',
//                         padding: '8px',
//                         borderRadius: '4px',
//                         border: '1px solid #ccc',
//                     }}
//                 />
//                 <input
//                     type="file"
//                     onChange={e => setFile(e.target.files[0])}
//                 />
//                 <button onClick={handleSendMessage}>전송</button>
//                 <button onClick={handleBackToMain}>메인으로 돌아가기</button>
//             </div>
//         </div>
//     );
// };

// export default ChatRoom;