import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FriendRequest from '../components/Friend/FriendRequest';
import "../components/assest/css/UserDetail.css";

const UserDetail = ({ type, item, closeModal, currentUser }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        let response;

        if (type === 'user') {
          response = await axios.get(`http://localhost:8080/api/user/detail`, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            params: {
              email: item?.email
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

  if (!data) return <p>로딩 중...</p>;

  // const profileImageUrl = data.profileImage && !data.profileImage.includes(':')
  //   ? `http://localhost:8080/uploads/${data.profileImage}`
  //   : '/default-profile.png';

  return (
    <div className="user-detail-modal">
      <button className="close-button" onClick={closeModal}>닫기</button>

      {type === 'user' && data && data.id && (
        <>
          <h3>사용자 정보</h3>
          <img
            src={data.profileImage ? `http://localhost:8080/uploads/${data.profileImage}` : '/default-profile.png'}
            alt={`${data.username || '사용자'}의 프로필 이미지`}
          />
          <p>이름: {data.username || '정보 없음'}</p>
          <p>이메일: {data.email || '정보 없음'}</p>
          <p>회사명: {data.company || '정보 없음'}</p>
          <p>직급: {data.position || '정보 없음'}</p>
          <p>핸드폰 번호: {data.phone || '정보 없음'}</p>
          <p>팩스 번호: {data.fax || '정보 없음'}</p>
          <p>계정 생성일: {data.createdAt || '정보 없음'}</p>
          
          <FriendRequest
            currentUser={currentUser}
            selectedUserId={data.id}
            fetchFriends={() => {}}
          />
        </>
      )}
    </div>
  );
};

export default UserDetail;
