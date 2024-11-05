import { useState, useEffect } from 'react';
import axios from 'axios';
import "../components/assest/css/UserDetail.css";

const UserDetails = ({ currentUser, user }) => {
    console.log("currentUser : " + currentUser);
    console.log("user : " + user);
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const [notification, setNotification] = useState('');
  const [user, setUser] = useState({ username: '', email: '', company: '', position: '', phone: '', fax: '', createdAt: ''});

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        console.log("token : " + token)

        if (token) {
            localStorage.setItem('token', token);
        }

        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8080/api/user/info', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log('반환된 유저 정보 :', response.data);
                    setUser({
                        username: response.data.username,
                        email: response.data.email,
                        company: response.data.company,
                        position: response.data.position,
                        phone: response.data.phone,
                        fax: response.data.fax,
                        createdAt: response.data.createdAt
                    });
                } catch (error) {
                    console.error('사용자 정보를 불러오는 중 에러 발생 : ', error);
                }
            }
        };

        fetchUserData();


    if (selectedUser) {
      const fetchFriendshipStatus = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/friends/status`, {
            params: { userId: currentUser.id, selectedUserId: selectedUser.id },
          });
          setFriendshipStatus(response.data);
        } catch (error) {
          console.error('친구 상태를 가져오는 중 오류 발생: ', error);
        }
      };

      fetchFriendshipStatus();
    }
  }, [selectedUser, currentUser]);

  const sendFriendRequest = async () => {
    try {
      await axios.post('http://localhost:8080/api/friends/request', {
        requesterId: currentUser.id,
        responderId: selectedUser.id,
      });
      setFriendshipStatus('PENDING');
      setNotification('친구 요청을 보냈습니다.');
    } catch (error) {
      console.error('친구 요청 중 오류 발생: ', error);
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      await axios.post(`http://localhost:8080/api/friends/accept`, {
        requestId,
      });
      setFriendshipStatus('ACCEPTED');
      setNotification('친구 요청을 수락했습니다.');
    } catch (error) {
      console.error('친구 요청 수락 중 오류 발생: ', error);
    }
  };

  const rejectFriendRequest = async (requestId) => {
    try {
      await axios.post(`http://localhost:8080/api/friends/reject`, {
        requestId,
      });
      setFriendshipStatus('REJECTED');
      setNotification('친구 요청을 거절했습니다.');
    } catch (error) {
      console.error('친구 요청 거절 중 오류 발생: ', error);
    }
  };

  const removeFriend = async (requestId) => {
    try {
      await axios.delete(`http://localhost:8080/api/friends/remove`, {
        params: { requestId },
      });
      setFriendshipStatus(null);
      setNotification('친구를 삭제했습니다.');
    } catch (error) {
      console.error('친구 삭제 중 오류 발생: ', error);
    }
  };

  return (
    <div className="user-details">
      <h3>사용자 정보</h3>
      <img 
        src={user?.profileImage ? user.profileImage : '../components/assest/imges/default_image.png'} 
        alt={`${user?.username || '사용자'}의 프로필 이미지`} 
      />
      <h2>{user?.username || '사용자 이름 없음'}</h2>
      <p>이메일: {user?.email || '사용자 이메일 없음'}</p>
      <p>회사명: {user?.company || '사용자 회사명 없음'}</p>
      <p>직급: {user?.position || '사용자 직급 없음'}</p>
      <p>핸드폰 번호: {user?.phone || '사용자 번호 없음'}</p>
      <p>팩스 번호: {user?.fax || '사용자 팩스번호 없음'}</p>
      <p>계정 생성일: {user?.createdAt || '사용자 생성일 없음' }</p>

      <div className="friend-actions">
        {friendshipStatus === 'PENDING' && (
          <>
            <p>친구 상태: 대기중</p>
            <button onClick={() => acceptFriendRequest(selectedUser.id)}>수락</button>
            <button onClick={() => rejectFriendRequest(selectedUser.id)}>거절</button>
          </>
        )}
        {friendshipStatus === 'ACCEPTED' && (
          <>
            <p>친구 상태: 수락됨</p>
            <button onClick={() => removeFriend(selectedUser.id)}>친구 삭제</button>
          </>
        )}
        {friendshipStatus === 'REJECTED' && <p>친구 상태: 거절됨</p>}
        {!friendshipStatus && <button onClick={sendFriendRequest}>친구 추가</button>}
      </div>

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default UserDetails;
