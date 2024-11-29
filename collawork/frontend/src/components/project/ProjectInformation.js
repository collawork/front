import React, { useEffect, useState, useRef } from "react";
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import ReactModal from "react-modal";
import { projectStore, stateValue } from '../../store';
import defaultImage from '../../components/assest/images/default-profile.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack, faCheckToSlot, faCalendar, faMinus, faGear, faBell, faFolderOpen, faD } from "@fortawesome/free-solid-svg-icons";
import ProjectModify from "./ProjectModify";
import '../../components/assest/css/ProjectInformation.css';
import ProjectBox from './ProjectBox';

const API_URL = process.env.REACT_APP_API_URL;

const ProjectInformation = () => {

  const [votingData, setVotingData] = useState([]); // 투표 정보 저장 (이름만)
  const [id, setId] = useState(null);
  const [participant, setParticipant] = useState([]);
  const modalRef = useRef();
  const [modal, setModal] = useState(false);
  const [show, setShow] = useState(false);
  const [managerModalOpen, setManagerModalOpen] = useState(false);
  const [noticesList, setNoticesList] = useState([]); // 초기값 빈 배열
  const [modify, setModify] = useState(false);
  const [calendarList, setCalendarList] = useState([]); // 초기값 빈 배열
  const { setHomeShow, setChatShow, setCalShow, setNotiShow, setVotig } = stateValue();
  const { projectName, projectData, userData, PlusProjectData, PlusUserData, projectInformationState } = projectStore();
  const { userId } = useUser();

  const fetchAcceptedParticipants = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("토큰이 없습니다.");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/api/user/projects/${projectData.id}/participants/accepted`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const formattedParticipants = response.data.map((participant) => ({
        name: participant.username || "이름 없음",
        email: participant.email || "이메일 없음",
      }));
      setParticipant(formattedParticipants);
      console.log(formattedParticipants);
    } catch (error) {
      console.error("참여자 목록을 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    if (managerModalOpen) {
      fetchAcceptedParticipants();

    }
  }, [managerModalOpen]);


  useEffect(() => {
    if (projectName) {
      Send(); // 1. projectName으로 프로젝트 정보 조회
      VotoingSend();
      setShow(true);
    }
  }, [projectName, projectInformationState]);

  useEffect(() => {
    if (projectData && projectData.id) {
      calendarSend(); // 다가오는 캘린더 일정(7일 이내)
      noticesSend(); // 등록된 중요 공지사항
      manager();
    }
  }, [projectData]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  function Send() {
    const token = localStorage.getItem('token');

    axios({
      url: `${API_URL}/api/user/projects/projectselect`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { projectName },
      baseURL: 'http://localhost:8080',
    }).then(function (response) {
      console.log(response);
      PlusProjectData(response.data[0]);
      if (!response.data || response.data.length === 0) {
        Send();
      }
    }).catch(err => console.error("프로젝트 정보 조회 오류:", err));
  }

  const changeHandler = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setId(e.target.value);
    console.log(id);
  }


  // 다가오는 (7일) 캘린더 조회
  function calendarSend() {
    const token = localStorage.getItem('token');
    const userIdValue = typeof userId === "object" && userId !== null ? userId.userId : userId;

    axios({
      url: `${API_URL}/api/user/projects/calendarList`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { projectId: projectData?.id, userId: userIdValue },
      baseURL: 'http://localhost:8080',
    }).then(function (response) {
      if (response.data) {
        setCalendarList(response.data);
      } else {
        setCalendarList([]); // 응답이 없을 경우 빈 배열로 설정
      }
    }).catch(err => console.error("캘린더 조회 오류:", err));
  }


  function noticesSend() { // 중요 공지사항 요청
    const token = localStorage.getItem('token');

    axios({
      url: `${API_URL}/api/user/projects/noticesSend`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { projectId: projectData?.id },
      baseURL: 'http://localhost:8080',
    }).then(function (response) {
      if (response?.data) {
        setNoticesList(response.data);
      } else {
        setNoticesList([]); // 응답이 없을 경우 빈 배열로 설정
      }
    }).catch(err => console.error("공지사항 조회 오류:", err));
  }



  function manager() {  // 담당자 정보 조회
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


  // 담당자 변경
  const managerModify = () => {
    const token = localStorage.getItem('token');
    axios({
      url: `${API_URL}/api/user/projects/managerModify`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { email: id, projectId: projectData.id },
    }).then(response => {
      console.log(response.data);
      setManagerModalOpen(false);
      setModify(false);
      alert("담당자가 변경되었습니다!");
    });
  };

  const managerModifyHandler = () => {
    if (String(userId) === String(userData.id)) {
      setManagerModalOpen(true);
    } else {
      alert("관리자 권한이 없습니다.");
    }
  };

  const onSubmitHandler = () => {

    if (id) {
      if (id !== String(userData.email)) {
        managerModify();
      } else {
        alert("현재 관리자 입니다.");
        return;
      }
    } else {
      alert("변경할 참여자를 선택해주세요.");
    }
  };

  const calendatHandler = () => {
    setHomeShow(false);
    setChatShow(false);
    setCalShow(true);
    setNotiShow(false);
    setVotig(false);
  }

  const noticesHandler = () => {
    setHomeShow(false);
    setChatShow(false);
    setCalShow(false);
    setNotiShow(true);
    setVotig(false);
  }

  // 1. 프로젝트에 귀속된 투표 list 조회 요청
  function VotoingSend() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token is missing");
      return;
    }

    if (!projectData || !projectData.id) {
      console.error("Invalid or missing project ID:", projectData);
      return;
    }

    axios({
      url: `${API_URL}/api/user/projects/findVoting`,
      headers: { Authorization: `Bearer ${token}` },
      params: { projectId: projectData.id },
      method: "post",
    })
      .then(function (response) {
        if (response.data) {
          
          setVotingData(response.data);
        } else {
          setVotingData(null);
        }
      })
      .catch(function (error) {
        if (error.response) {

          console.error("Response error:", error.response.status, error.response.data);
        } else if (error.request) {

          console.error("No response received:", error.request);
        } else {

          console.error("Axios error:", error.message);
        }
      });
  }




  return (
    <>
      {show && (
        <div className="project-box">
          <div className="project-container">
            <div className="project-header">
           <FontAwesomeIcon icon={faFolderOpen}  className="project-icon"/>
              <h2>{projectData.projectName}</h2>
              <span className="project-code">{projectData.projectCode}</span>
              <button className="icon-button" onClick={() => setModify(true)}>
                <FontAwesomeIcon icon={faGear} />
                {modify && (
                  <ProjectModify
                    setModify={(value) => {
                      setModify(value);
                    }}
                  />
                )}
              </button>
              <div className="adminBox">
              <div
                style={{
              // position: "absolute", // 절대 위치 지정
              top: "10px",          // 상단 10px
              right: "5px",        // 우측 10px
              display: "flex",
              alignItems: "center",
              zIndex: 1000,         // 다른 요소 위로 올리기
                }}
              >
                관리자 :

            </div>

            <div className="projectBar">
              <ProjectBox userId={userId} createdBy={projectData.createdBy} />
            </div>


            {/* 기존의 일정 및 공지사항 섹션 */}
            <div className="list-container">
              {calendarList.length > 0 ? (
                <ul className="list">
                  {calendarList.map((calendarItem, index) => {
                    // Calculate the days remaining until the start time
                    const today = new Date();
                    const startTime = new Date(calendarItem.start_time);
                    const daysRemaining = Math.ceil((startTime - today) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

                    return (
                      <li key={index} className="list-item">
                        <div className="icon-container">

                          <FontAwesomeIcon icon={faThumbtack} color="purple" className="icon" />
                          <FontAwesomeIcon icon={faCalendar} className="icon" />
                          {daysRemaining > 0 && (
                            <span style={{ color: "red", marginRight: "5px", fontWeight: "bold" }}>
                              {/* <FontAwesomeIcon icon={faD} />  */}
                              D - {daysRemaining}
                            </span>
                          )}
                        </div>
                        <div className="list-content" onClick={calendatHandler}>
                          <h3>{calendarItem.title}</h3>
                          <p>
                            {new Date(calendarItem.start_time).toLocaleString()} ~{" "}
                            {new Date(calendarItem.end_time).toLocaleString()}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul className="list">
                  <li className="list-item">
                    <div className="icon-container">
                      <FontAwesomeIcon icon={faThumbtack} color="purple" className="icon" />
                      <FontAwesomeIcon icon={faCalendar} className="icon" />
                    </div>
                    <div className="list-content" onClick={calendatHandler}>
                      <h3>다가오는 일정이 없습니다.</h3>
                    </div>
                  </li>
                </ul>
              )}

              {noticesList.length > 0 ? (
                <ul className="list">
                  {noticesList.map((list, index) => (
                    <li key={index} className="list-item">
                      <div className="icon-container">
                        <FontAwesomeIcon color="purple" icon={faThumbtack} className="icon" />
                        <FontAwesomeIcon icon={faBell} className="icon" />
                      </div>
                      <div className="list-content" onClick={noticesHandler}>
                        <h3>{list.title}</h3>
                        <p>{new Date(list.createdAt).toLocaleString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="list">
                  <li className="list-item">
                    <div className="icon-container">
                      <FontAwesomeIcon color="purple" icon={faThumbtack} className="icon" />
                      <FontAwesomeIcon icon={faBell} className="icon" />
                    </div>
                    <div className="list-content" onClick={noticesHandler}>
                      <h3>주요 공지사항이 없습니다.</h3>
                    </div>
                  </li>
                </ul>
              )}
            </div>

            {/* {modify && (
              <ProjectModify
                setModify={(value) => {
                  setModify(value);
                }}
              />
            )} */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", position: "relative" }}>
              <img
                src={userData?.profileImageUrl || defaultImage}
                alt={`${userData?.username || "사용자"}의 프로필 이미지`}
                onClick={() => setModal(!modal)}
                className="profile-image-small"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                  cursor: "pointer",
                  marginLeft:"10px"
                }}
              />
               <h3>{userData?.username || "정보 없음"}</h3>
              <button className="admin" onClick={managerModifyHandler}>관리자 변경</button>
            </div>
            </div>
              관리자 : <h3>{userData?.username || "정보 없음"}</h3>
              <button onClick={managerModifyHandler}>관리자 변경</button>


            </div>

            

            <div className="project-wrapper">
  <div className="projectBox">
    <ProjectBox userId={userId} createdBy={projectData.createdBy} />
  </div>
  <div className="list-container">
    {/* 일정 섹션 */}
    {calendarList.length > 0 ? (
      <ul className="list">
        {calendarList.map((calendarItem, index) => {
          const today = new Date();
          const startTime = new Date(calendarItem.start_time);
          const daysRemaining = Math.ceil((startTime - today) / (1000 * 60 * 60 * 24));
          return (
            <li key={index} className="list-item">
              <div className="icon-container" onClick={calendatHandler}>
                <FontAwesomeIcon icon={faThumbtack} color="purple" className="icon" />
                <FontAwesomeIcon icon={faCalendar} className="icon" />
                {daysRemaining === 0 ? (
                  <span style={{ color: "red", marginRight: "5px", fontWeight: "bold" }}>D - Day</span>
                ) : (
                  <span style={{ color: "red", marginRight: "5px", fontWeight: "bold" }}>D - {daysRemaining}</span>
                )}
              </div>
              <div className="list-content" onClick={calendatHandler}>
                <h3>{calendarItem.title}</h3>
                <p>
                  {new Date(calendarItem.start_time).toLocaleString()} ~{" "}
                  {new Date(calendarItem.end_time).toLocaleString()}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    ) : (
                    <ul className="list-contentist">
                    <li className="list-item">
                    <div className="icon-container" onClick={calendatHandler}>
                      <FontAwesomeIcon icon={faThumbtack} color="purple" className="icon" />
                      <FontAwesomeIcon icon={faCalendar} className="icon" />
                    </div>
                    <div className="list-content" >
                    <h3>다가오는 일정이 없습니다.</h3>
                    </div>
                    </li>
                  </ul> )}
        
                          {noticesList.length > 0 ? (
                            <ul className="list">
                              {/* <h4 style={{color:"gray"}}>주요 공지사항</h4> */}
                              {noticesList.map((list, index) => (
                                <li key={index} className="list-item">
                                  <div className="icon-container" onClick={calendatHandler}>
                                    <FontAwesomeIcon color="purple" icon={faThumbtack} className="icon" />
                                    <FontAwesomeIcon icon={faBell} className="icon" />
                                  </div>
                                  <div className="list-content">
                                    <h3>{list.title}</h3>
                                    <p>{new Date(list.createdAt).toLocaleString()}</p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
      <ul className="list">
        <li className="list-item">
          <div className="icon-container" onClick={calendatHandler}>
            <FontAwesomeIcon icon={faThumbtack} color="purple" className="icon" />
            <FontAwesomeIcon icon={faCalendar} className="icon" />
          </div>
          <div className="list-content">
            <h3>다가오는 일정이 없습니다.</h3>
          </div>
        </li>
      </ul>
    )}
    {/* 공지사항 섹션 */}
    {noticesList.length > 0 ? (
      <ul className="list">
        {noticesList.map((list, index) => (
          <li key={index} className="list-item">
            <div className="icon-container" onClick={calendatHandler}>
              <FontAwesomeIcon color="purple" icon={faThumbtack} className="icon" />
              <FontAwesomeIcon icon={faBell} className="icon" />
            </div>
            <div className="list-content">
              <h3>{list.title}</h3>
              <p>{new Date(list.createdAt).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <ul className="list">
        <li className="list-item">
          <div className="icon-container" onClick={calendatHandler}>
            <FontAwesomeIcon color="purple" icon={faThumbtack} className="icon" />
            <FontAwesomeIcon icon={faBell} className="icon" />
          </div>
          <div className="list-content">
            <h3>주요 공지사항이 없습니다.</h3>
          </div>
        </li>
      </ul>
    )}
  </div>
</div>
  
                {modify && (
                  <ProjectModify
                    setModify={setModify}
                  />
                )}
              </div>
         

              {/* 투표 찍어주기 */}
              <br/>
              <br/>
              <br/>
              <br/>
          
                <h4 style={{color:"red"}}>진행중 <FontAwesomeIcon icon={faCheckToSlot} style={{color:"black"}}/></h4>
                {votingData.length ? (
                // 투표 중인 항목만 필터링
                votingData
                  .filter((vote) => vote.vote === true) 
                  .map((vote) => (
                    <section key={vote.id} className="voting-card">
                      <ul>
                        <li>{vote.votingName}</li>
                      </ul>
                    </section>
                  ))
                  ) : (
                    <h5>진행중인 투표가 없습니다.</h5>
                  )}

                <ReactModal
                    isOpen={managerModalOpen}
                    onRequestClose={() => setManagerModalOpen(false)}
                    contentLabel="managerModify"
                    appElement={document.getElementById("root")}
                    style={{
                      content: {
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "300px",
                        padding: "10px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                      },
                      overlay: {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                      <ul>
                        <h4>관리자로 변경 할 참가자를 선택하세요.</h4>
                        {participant.map((part) => (
                          <li key={part.email}>
                            <input
                              type="radio"
                              id={`participant-${part.email}`}
                              name="adminParticipant"
                              value={part.email}
                              onChange={(e) => changeHandler(e)}
                            />
                            <label htmlFor={`participant-${part.email}`}>
                              {part.id} {part.name} - {part.email}
                            </label>
                          </li>
                        ))}
                      </ul>
                      <button onClick={onSubmitHandler}>변경하기</button>
                      <button onClick={() => setManagerModalOpen(false)}>취소</button>
                    </ReactModal>

                  <h5 className="created-at">{ projectData.createdAt? projectData.createdAt.split('T')[0] : '정보없음' }</h5> 

                </div>
              )}
            </>
          );
        }
          {/* 마지막 줄 날짜 찍어주기 부분 */}
          <h5 className="created-at">{projectData?.createdAt}</h5>

          {/* 투표 찍어주기 */}
          <h4 style={{ color: "red" }}>진행중 <FontAwesomeIcon icon={faCheckToSlot} style={{ color: "black" }} /></h4>
          {votingData.length ?
            votingData.map((vote) => (
              <section key={vote.id} className="voting-card">
                <ul>
                  <li>{vote.votingName}</li>
                </ul>
              </section>
            ))
            :
            <h5>진행중인 투표가 없습니다.</h5>

          }


          {/*  여긴 모달 */}
          <ReactModal
            isOpen={managerModalOpen}
            onRequestClose={() => setManagerModalOpen(false)}
            contentLabel="managerModify"
            className="change-admin-modal"
            style={{
              overlay: { backgroundColor: "transparent", }
            }}
          // appElement={document.getElementById("root")}
          // style={{
          //   content: {
          //     top: "50%",
          //     left: "50%",
          //     transform: "translate(-50%, -50%)",
          //     width: "300px",
          //     padding: "10px",
          //     borderRadius: "10px",
          //     border: "1px solid #ccc",
          //   },
          //   overlay: {
          //     backgroundColor: "transparent",
          //   },
          // }}
          >
            {/* <ul className= "change-admin-modal"> */}
            <h4>관리자로 변경 할 참가자를 선택하세요.</h4>
            {participant.map((part) => (
              <li key={part.email}>
                <input
                  type="radio"
                  id={`participant-${part.email}`}
                  name="adminParticipant"
                  value={part.email}
                  onChange={(e) => changeHandler(e)}
                />
                <label htmlFor={`participant-${part.email}`}>
                  {part.id} {part.name} - {part.email}
                </label>
              </li>
            ))}

            <button className="confirm-btn" onClick={onSubmitHandler}>변경하기</button>
            <button className="cancel-btn" onClick={() => setManagerModalOpen(false)}>취소</button>
            {/* </ul> */}
          </ReactModal>

        </div>
      )}
    </>
  );
}



export default ProjectInformation;