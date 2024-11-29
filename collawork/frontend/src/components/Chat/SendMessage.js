import axios from 'axios';
import { useState, useEffect } from 'react';
import ModalPage from './ModalPage'; 
import ChatRoomOne from './ChatRoomOne';  

const SendMessage = ({ username, userId }) => {
    const [senderId, setSenderId] = useState('');
    // const [myName, setUsername] = useState('');  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentChatRoom, setCurrentChatRoom] = useState(null);

 

    const openModal = (chatRoomId) => {
        console.log('openModal 호출, chatRoomId:', chatRoomId);  // 로그로 확인
        setCurrentChatRoom(chatRoomId);  // 채팅방 ID 저장
        setIsModalOpen(true);  // 모달 열기
    };

    const closeModal = () => {
        setIsModalOpen(false);  // 모달 닫기
        setCurrentChatRoom(null);  // 채팅방 ID 초기화
    };

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
                    // setUsername(response.data.username || '알 수 없음');
                } else {
                    console.error('서버로부터 사용자 정보를 가져오지 못했습니다.');
                }
            } catch (error) {
                console.error('사용자 정보를 불러오는 중 에러 발생:', error);
            }
        };

        fetchUserData();
    }, []);

    const send = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('토큰이 없습니다. 메시지를 보낼 수 없습니다.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/api/user/chatrooms/new',
                {
                    created_by: senderId,
                    roomName: username,
                    receiverId: userId,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const { status, chatRoomId} = response.data;

            if (status === 'exists') {
              
                openModal(chatRoomId);  // 기존 채팅방 열기
            } else if (status === 'created') {
                
                alert('새로운 채팅방이 생성되었습니다.');
                openModal(chatRoomId);  // 새로 생성된 채팅방 ID로 모달 열기
            }
        } catch (error) {
            console.error('오류 발생:', error);
            alert('채팅방 생성 중 오류가 발생했습니다.');
        }
    };

    return (
        <>
            <button onClick={send}
                style={{
                        padding: "5px 10px",
                      border: "1px solid #ddd",
                      background: "none",
                      cursor: "pointer",
                      fontsize: "0.9rem",
                      borderRadius: "5px",
                     
                  }}>
                메세지 보내기
            </button>

            {isModalOpen && (
                <ModalPage onClose={closeModal}>
                    <ChatRoomOne chatRoomId={currentChatRoom} />  
                </ModalPage>
            )}
        </>
    );
};

export default SendMessage;