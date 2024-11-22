import { useEffect, useState, useRef } from "react";
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { projectStore } from '../../store';
import defaultImage from '../../components/assest/images/default-profile.png';
import {faBars} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



const API_URL = process.env.REACT_APP_API_URL;

const ProjectInformation = () => {
  const modalRef = useRef();
  const [modal, setModal] = useState(false);
  const [show, setShow] = useState(false);
  const [modify, setModify] = useState(false);
  const [calendarList,setCalendarList] = useState(); // 다가오는 일정 응답
  const { projectName, projectData, userData, PlusProjectData, PlusUserData } = projectStore();
  const { userId } = useUser();

  useEffect(() => {
    if (projectName) {
      Send();  // 1. projectName 으로 프로젝트 정보 조회
      setShow(true);
     // calendarSend();
    }
  }, [projectName]);

  useEffect(() => {
    if (projectData.createdBy) {
      manager(); // 프로젝트 데이터의 createdBy가 있을 때만 유저 정보 조회
    }
  }, [projectData]); // projectData가 업데이트될 때마다 실행

  function Send() { // 프로젝트 정보 조회
    const token = localStorage.getItem('token');

    axios({
      url: `${API_URL}/api/user/projects/projectselect`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { projectName },
      baseURL: 'http://localhost:8080',
    }).then(function(response) {
      console.log(response);
      PlusProjectData(response.data[0]);
      if (!response.data || response.data.length === 0) {
        Send();
      }
    });
  }

//   function calendarSend(){ // 다가오는 프로젝트 calendar
//     const token = localStorage.getItem('token');

//     axios({
//       url: `${API_URL}/api/user/projects/calendarList`,
//       headers: { 'Authorization': `Bearer ${token}` },
//       method: 'post',
//       params: { projectData:projectData.id, userId:userId }, // 프로젝트 id, userId 
//       baseURL: 'http://localhost:8080',
//     }).then(function(response) {
//       console.log(response);
//       if(response){
//         setCalendarList(response.data);
//       }
//       if (!response.data || response.data.length === 0) {
//         Send();
//       }
//     });

  // };

  function manager() { // 유저 정보 조회
    const token = localStorage.getItem('token');
    if (!projectData) {
      Send();
    }

    axios({
      url: `${API_URL}/api/user/projects/projecthomeusers`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { id: projectData.createdBy },
      baseURL: 'http://localhost:8080',
    }).then(function(response) {
      PlusUserData(response.data);
    });
  }


  return (
    <>
      {show && (
        <div>
          <h3>프로젝트 이름 : {projectData.projectName}</h3>
          <h5>- {projectData.projectCode}</h5>
          <button onClick={()=> modify? setModify(false):setModify(true)}><FontAwesomeIcon icon={faBars}/></button>
          <div className="user-info-dropdown" ref={modalRef} style={{ position: 'relative' }}>
            <img
              src={userData.profileImageUrl || defaultImage}
              alt={`${userData.username || '사용자'}의 프로필 이미지`}
              onClick={() => setModal(!modal)} 
              className="profile-image-small"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "10px",
                cursor: "pointer",
                objectFit: "cover",
              }}
            />
            {userData.username || '정보 없음'}
            {modal && (
              <div
                className="modal-info"
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '50px', 
                  backgroundColor: 'white',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  width: '200px',
                  zIndex: 1000,
                }}
              >
                <p>이름: {userData.username || '정보 없음'}</p>
                <p>이메일: {userData.email || '정보 없음'}</p>
                <p>회사명: {userData.company || '정보 없음'}</p>
                <p>직급: {userData.position || '정보 없음'}</p>
                <p>핸드폰 번호: {userData.phone || '정보 없음'}</p>
                <p>fax: {userData.fax || '정보 없음'}</p>
              </div>
            )}
             <div ref={modalRef}  style={{ position: 'relative' }}>
        </div>
          </div>
          <h6>{projectData.createdAt}</h6>
          <h6>+다가올 캘린더 속 일정 공지, +최근 공지사항, +중요공지</h6>
        </div>
      )}
      <div ref={modalRef} style={{ position: 'relative' }}>
  {modify && (
    <>
      <input 
        type="text" 
        placeholder="관리자 변경" 
        readOnly 
        onClick={() => console.log('관리자 변경 클릭됨')} 
        style={{ cursor: 'pointer' }} 
      />
      <input 
        type="text" 
        placeholder="채팅방 이름 변경" 
        readOnly 
        onClick={() => console.log('채팅방 이름 변경 클릭됨')} 
        style={{ cursor: 'pointer' }} 
      />
    </>
  )}
</div>
    </>
  );
};

export default ProjectInformation;
