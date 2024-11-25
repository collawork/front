import { useEffect, useState, useRef } from "react";
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { projectStore } from '../../store';
import defaultImage from '../../components/assest/images/default-profile.png';
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProjectModify from "./ProjectModify";

const API_URL = process.env.REACT_APP_API_URL;

const ProjectInformation = () => {
  const modalRef = useRef();
  const [modal, setModal] = useState(false);
  const [show, setShow] = useState(false);
  const [noticesList, setNoticesList] = useState([]); // 초기값 빈 배열
  const [modify, setModify] = useState(false);
  const [calendarList, setCalendarList] = useState([]); // 초기값 빈 배열
  const { projectName, projectData, userData, PlusProjectData, PlusUserData } = projectStore();
  const { userId } = useUser();
  const [title, setTitle] = useState();

  useEffect(() => {
    if (projectName) {
      Send(); // 1. projectName으로 프로젝트 정보 조회
      setShow(true);
      calendarSend(); // 다가오는 캘린더 일정(7일 이내)
      noticesSend(); // 등록된 중요 공지사항
    }
  }, [projectName]);

  useEffect(() => {
    if (projectData.createdBy) {
      manager(); // 프로젝트 데이터의 createdBy가 있을 때만 유저 정보 조회
    }
  }, [projectData]);

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
      console.log(response.data[0]);
      if (!response.data || response.data.length === 0) {
        Send();
      }
    }).catch(err => console.error("프로젝트 정보 조회 오류:", err));
  }



  function calendarSend() { // 다가오는 프로젝트 캘린더
    const token = localStorage.getItem('token');
    const userIdValue =
    typeof userId === "object" && userId !== null ? userId.userId : userId;
    console.log("캘린더 일정 : " + userIdValue);

    axios({
      url: `${API_URL}/api/user/projects/calendarList`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { projectId:projectData?.id, userId:userId }, // 프로젝트 id, userId 
      baseURL: 'http://localhost:8080',
    }).then(function (response) {
      console.log(response.data[0]);
      if (response) {
        setCalendarList(response.data[0]); // 캘린더 데이터를 설정
        console.log(response.data[0].title);
        setTitle(response.data[0].title);
      } else {
        setCalendarList([]); // 응답이 없을 경우 빈 배열로 설정
      }
    }).catch(err => console.error("캘린더 조회 오류:", err));
  };


  
    function noticesSend(){ // 중요 공지사항 
      const token = localStorage.getItem('token');

    axios({
      url: `${API_URL}/api/user/projects/noticesSend`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { projectId: projectData?.id }, // 프로젝트 id
      baseURL: 'http://localhost:8080',
    }).then(function (response) {
      console.log(response);
      if (response?.data) {
        setNoticesList(response.data); // 공지사항 데이터를 설정
      } else {
        setNoticesList([]); // 응답이 없을 경우 빈 배열로 설정
      }
    }).catch(err => console.error("공지사항 조회 오류:", err));
  }

  function manager() { // 유저 정보 조회
    const token = localStorage.getItem('token');

    axios({
      url: `${API_URL}/api/user/projects/projecthomeusers`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { id: projectData?.createdBy },
      baseURL: 'http://localhost:8080',
    }).then(function (response) {
      PlusUserData(response.data);
    }).catch(err => console.error("유저 정보 조회 오류:", err));
  }

  return (
    <>
      {show && (
        <div>
          <h5>다가오는 일정</h5>
          
         
         {calendarList? (
            <ul>
             
              <li>{calendarList.title}</li>
              <h6>{calendarList.start_time}--{calendarList.end_time}</h6>
             
              {/* {calendarList.map((list, index) => (
                <li key={index}>
                  <h5>{list.title}</h5>
                  <h6>{list.start_time} -- {list.end_time}</h6>
                </li>
              ))} */}
            </ul>
          ) : (
            <p>다가오는 일정이 없습니다.</p>
          )}

        <h5>중요 공지사항</h5>
        {noticesList.length? (
          <ul>
            {noticesList.map((list, index)=>(
              <li key={index}>
                <h5>{list.title}</h5>
                <h5>{list.creatorId}</h5> 
                <h6>{list.createdAt}</h6>
              </li>
            ))}
          </ul>
        )
        :
        <h5>중요 공지사항이 없습니다.</h5>
      }
         
          <h3>프로젝트 이름 : {projectData.projectName}</h3>
          <h5>- {projectData.projectCode}</h5>
          <button onClick={()=>setModify(true)}><FontAwesomeIcon icon={faBars}/></button>
          <div className="user-info-dropdown" ref={modalRef} style={{ position: 'relative' }}>
            <img
              src={userData?.profileImageUrl || defaultImage}
              alt={`${userData?.username || '사용자'}의 프로필 이미지`}
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
            {modify && <ProjectModify setModify={setModify} />}
            {userData?.username || '정보 없음'}
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
                <p>이름: {userData?.username || '정보 없음'}</p>
                <p>이메일: {userData?.email || '정보 없음'}</p>
                <p>회사명: {userData?.company || '정보 없음'}</p>
                <p>직급: {userData?.position || '정보 없음'}</p>
                <p>핸드폰 번호: {userData?.phone || '정보 없음'}</p>
                <p>fax: {userData?.fax || '정보 없음'}</p>
              </div>
            )}
          </div>
          <h6>{projectData?.createdAt}</h6>
        </div>
      )}
    </>
  );
};

export default ProjectInformation;
