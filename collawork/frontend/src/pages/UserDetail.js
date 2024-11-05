// src/pages/UserDetail.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/Axios';
import "../components/assest/css/UserDetail.css";

const UserDetail = ({ type, item, closeModal, currentUser }) => {
  const [data, setData] = useState(null);
  const [friendshipStatus, setFriendshipStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        let response;

        if (type === 'user') {
          response = await axiosInstance.get(`/user/detail`, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            params: {
              email: item?.email // 선택한 사용자의 이메일로 조회
            }
          });
          setData(response.data);

          // 친구 상태 가져오기 (currentUser와 data.id가 모두 있어야 실행)
          if (currentUser?.id && response.data?.id) {
            const friendStatusResponse = await axiosInstance.get(`/friends/status`, {
              headers: {
                'Authorization': `Bearer ${token}`
              },
              params: {
                userId: currentUser.id, // 현재 로그인한 사용자 ID
                selectedUserId: response.data.id // 선택된 사용자의 ID
              }
            });
            setFriendshipStatus(friendStatusResponse.data);
          }
        } else if (type === 'project') {
          response = await axiosInstance.get(`/user/projects/${item.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setData(response.data);
        } else if (type === 'chatRoom') {
          response = await axiosInstance.get(`/user/chatrooms/${item.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setData(response.data);
        }
      } catch (error) {
        console.error(`${type} 정보를 불러오는 중 오류 발생: `, error);
      }
    };

    fetchData();
  }, [type, item, currentUser]);

  const handleFriendRequest = async () => {
    if (!currentUser?.id || !data?.id) return; // ID가 없으면 요청 중단
    try {
      const response = await axiosInstance.post('/friends/request', null, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        params: { requesterId: currentUser.id, responderId: data.id }
      });
      setFriendshipStatus('PENDING');
      alert(response.data);
    } catch (error) {
      console.error('친구 요청 중 오류 발생: ', error);
    }
  };

  const handleRemoveFriend = async () => {
    if (!data?.id) return; // 친구 삭제하려는 ID가 없으면 요청 중단
    try {
      const response = await axiosInstance.delete('/friends/remove', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        params: { requestId: data.id }
      });
      setFriendshipStatus(null);
      alert(response.data);
    } catch (error) {
      console.error('친구 삭제 중 오류 발생: ', error);
    }
  };

  if (!data) return <p>로딩 중...</p>;

  return (
    <div className="user-detail-modal">
      <button className="close-button" onClick={closeModal}>닫기</button>

      {type === 'user' && (
        <>
          <h3>사용자 정보</h3>
          <img
            src={data.profileImage || '../components/assest/imges/default_image.png'}
            alt={`${data.username || '사용자'}의 프로필 이미지`}
          />
          <p>이름: {data.username || '정보 없음'}</p>
          <p>이메일: {data.email || '정보 없음'}</p>
          <p>회사명: {data.company || '정보 없음'}</p>
          <p>직급: {data.position || '정보 없음'}</p>
          <p>핸드폰 번호: {data.phone || '정보 없음'}</p>
          <p>팩스 번호: {data.fax || '정보 없음'}</p>
          <p>계정 생성일: {data.createdAt || '정보 없음'}</p>
          
          {/* 친구 상태에 따라 다른 버튼을 표시 */}
          <div className="friend-actions">
            {friendshipStatus === 'PENDING' && <p>친구 요청 상태: 대기중</p>}
            {friendshipStatus === 'ACCEPTED' && (
              <>
                <p>친구 상태: 수락됨</p>
                <button onClick={handleRemoveFriend}>친구 삭제</button>
              </>
            )}
            {friendshipStatus !== 'ACCEPTED' && friendshipStatus !== 'PENDING' && (
              <button onClick={handleFriendRequest}>친구 추가</button>
            )}
          </div>
        </>
      )}

      {type === 'project' && (
        <>
          <h3>프로젝트 정보</h3>
          <p>프로젝트명: {data.projectName || '정보 없음'}</p>
          <p>프로젝트 코드: {data.projectCode || '정보 없음'}</p>
          <p>생성일: {data.createdAt || '정보 없음'}</p>
        </>
      )}

      {type === 'chatRoom' && (
        <>
          <h3>채팅방 정보</h3>
          <p>채팅방 이름: {data.roomName || '정보 없음'}</p>
          <p>생성일: {data.createdAt || '정보 없음'}</p>
        </>
      )}
    </div>
  );
};

export default UserDetail;
