import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FriendRequest from '../components/Friend/FriendRequest';
import "../components/assest/css/UserDetail.css";
import defaultImage from '../components/assest/images/default-profile.png';
import SendMessage from "../components/Chat/SendMessage";

const UserDetail = ({ type, item, closeModal, currentUser }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/user/detail`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            email: item?.email,
          }
        });
        setData(response.data);
      } catch (error) {
        console.error(`${type} 정보를 불러오는 중 오류 발생: `, error);
      }
    };

    fetchData();
  }, [type, item, currentUser]);

  if (!data) return <p>로딩 중...</p>;

  return (
    <div 
      className="modal-overlay-user-detail" 
      onClick={closeModal} // 모달 외부 클릭 시 닫힘
    >
      <div 
        className="user-detail-modal" 
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 이벤트 전파 방지
      >
        <button className="close-button-user-detail" onClick={closeModal}>
          닫기
        </button>

        {type === 'user' && data && data.id && (
          <>
            <h3>사용자 정보</h3>
            <img
              src={data.profileImage ? `http://localhost:8080/uploads/${data.profileImage}` : defaultImage}
              alt={`${data.username || '사용자'}의 프로필 이미지`}
            />
            <p>이름: {data.username || '정보 없음'}</p>
            <p>이메일: {data.email || '정보 없음'}</p>
            <p>회사명: {data.company || '정보 없음'}</p>
            <p>직급: {data.position || '정보 없음'}</p>
            <p>핸드폰 번호: {data.phone || '정보 없음'}</p>
            <p>팩스 번호: {data.fax || '정보 없음'}</p>
            <p>계정 생성일: {data.createdAt || '정보 없음'}</p>
            <SendMessage username={data.username} userId={data.id}/>
            <FriendRequest
              currentUser={currentUser}
              selectedUserId={data.id}
              fetchFriends={() => {}}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
