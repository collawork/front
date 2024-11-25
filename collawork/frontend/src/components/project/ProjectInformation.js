import { useEffect, useState, useRef } from "react";
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { projectStore } from '../../store';
import defaultImage from '../../components/assest/images/default-profile.png';
import {faBars} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProjectModify from "./ProjectModify";
import { Color } from "three";

const API_URL = process.env.REACT_APP_API_URL;

const ProjectInformation = () => {
  const modalRef = useRef();
  const [modal, setModal] = useState(false);
  const [show, setShow] = useState(false);
  const [noticesList,setNoticesList] = useState(); // 중요한 공지사항
  const [modify, setModify] = useState(false);
  const [calendarList,setCalendarList] = useState(); // 다가오는 일정 응답
  const { projectName, projectData, userData, PlusProjectData, PlusUserData } = projectStore();
  const { userId } = useUser();

  useEffect(() => {
    if (projectName) {
      Send();  // 1. projectName 으로 프로젝트 정보 조회
      setShow(true);
      calendarSend(); // 다가오는 캘린더 일정(7일 이내)
      noticesSend(); // 등록된 중요 공지사항
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
  
      PlusProjectData(response.data[0]);
      console.log(response.data[0]);
      if (!response.data || response.data.length === 0) {
        Send();
      }
    });
  }



  function calendarSend(){ // 다가오는 프로젝트 calendar
    const token = localStorage.getItem('token');
    const userIdValue =
    typeof userId === "object" && userId !== null ? userId.userId : userId;
    console.log("캘린더 일정 : " + userIdValue);

    axios({
      url: `${API_URL}/api/user/projects/calendarList`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { projectId:projectData.id, userId:userIdValue }, // 프로젝트 id, userId 
      baseURL: 'http://localhost:8080',
    }).then(function(response) {
      console.log(response);
      if(response){
        setCalendarList(response.data); // 배열로 받아야 하나?
        console.log(response.data);
      }
      if (!response.data || response.data.length === 0) {
        Send();
      }
    });
  };


  
    function noticesSend(){ // 중요 공지사항 
      const token = localStorage.getItem('token');
      
      if(!projectData){
        Send();
      }
      console.log("noticesSend 타는중:: " + projectData.id);

      axios({
        url: `${API_URL}/api/user/projects/noticesSend`,
        headers: { 'Authorization': `Bearer ${token}` },
        method: 'post',
        params: { projectData:projectData.id}, // 프로젝트 id
        baseURL: 'http://localhost:8080',
      }).then(function(response) {
        console.log(response);
        if(response){
          setNoticesList(response.data);// 배열로 받아야 하나?
          console.log(response.data);
        }
      });
    }




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
          <h5>다가오는 일정</h5>
         
         {calendarList ? (
            <ul>
              {calendarList.map((list, index)=>(
                <li key={index}>
                  <h5>{list.title}</h5>
                  <h6>{list.startTime} -- {list.endTime}</h6>
                  {/* 시작시간이 빠른것부터 보여주기 */}
                </li>
              ))}
            </ul>
          )
          :
          <p>다가오는 일정이 없습니다.</p>
        }

        <h5>중요 공지사항</h5>
        {noticesList ? (
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
            {modify && <ProjectModify setModify={setModify}/>}
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
    </>
  )
}

export default ProjectInformation;
