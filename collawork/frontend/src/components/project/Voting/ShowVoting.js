import React, { useState, useEffect } from "react";

import NewVoting from '../Voting/NewVoting';
import { projectStore } from '../../../store';
import defaultImage from '../../../components/assest/images/default-profile.png';
import '../../assest/css/UserInfoModal.css';
import '../../assest/css/Pagination.css';
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import '../../../components/assest/css/ShowVoting.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUsers,faCheckToSlot,faCheck,faPenToSquare} from "@fortawesome/free-solid-svg-icons";


const API_URL = process.env.REACT_APP_API_URL;

const ShowVoting = () => {

    const [idVoteState, setIdVoteState] = useState(false);
    const [activeProfile, setActiveProfile] = useState(null);
    const [votingData, setVotingData] = useState([]);
    const [contentsData, setContentsData] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const { projectData} = projectStore();
    const [rere, setRere] = useState(false);
    const [state, setState] = useState();
    const { userId } = useUser();
    const [userVotes, setUserVotes] = useState({}); // 각 투표별로 상태를 관리하기 위한 상태 객체 추가
    const [voteResults, setVoteResults] = useState([{}]);
    const [votingByUser, setVotingByUser] = useState([]);
    const [updataList, setUpdateList] = useState();
    const toggleProfileModal = (id) => {
      setActiveProfile((prev) => (prev === id ? null : id)); 
    };
    const [totalVotes, setTotalVotes] = React.useState({});

useEffect(() => {
  const totals = {};
  Object.keys(voteResults).forEach((voteId) => {
    totals[voteId] = Object.values(voteResults[voteId] || {}).reduce((acc, count) => acc + count, 0);
  });
  setTotalVotes(totals);
}, [voteResults]);

    

    useEffect(() => {
        if(userId){
            handler();
        }
        }, [modalShow, userId,idVoteState,rere ]);

    const handleModalClose = () => {
        setModalShow(false);
        handler(); 
          };

    
            const updateVotingList = async () => {
              await  Send(); // 투표 목록 다시 불러오기
              await contentsSend();
            };

    // 1. 프로젝트에 귀속된 투표 list 조회 요청
    const Send = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios({
            url: `${API_URL}/api/user/projects/findVoting`,
            headers: { Authorization: `Bearer ${token}` },
            params: { projectId: projectData.id },
            method: "post",
          });
          setVotingData(response.data);
          VotingBySend(response.data);
         
          return response.data;
        } catch (error) {
          console.error("Voting error:", error);
        }
      };

     // 2. 프로젝트에 귀속된 투표들의 각각 항목 조회 요청
    const contentsSend = async (votingId) => {
        try {
        const token = localStorage.getItem('token');
        const response = await axios({
            url: `${API_URL}/api/user/projects/findContents`,
            headers: { 'Authorization': `Bearer ${token}` },
            params: { votingId: votingId },
            method: 'post',
        });
        return response.data;
        } catch (error) {
        console.error(`vote contents 데이터 오류  ${votingId}:`, error);
        return [];
        }
    };

   //  3. user가 투표 한 항목 정보 조회 
    const userVoteSend = async (voteId) => {
        try {
        const token = localStorage.getItem('token');
        const response = await axios({
            url: `${API_URL}/api/user/projects/findUserVoting`,
            headers: { 'Authorization': `Bearer ${token}` },
            params: { votingId: voteId, userId: userId },
            method: 'post',
        });
        console.log(response);
            // 투표 아이디와 해당 유저의 id 를 보냄-> 투표 항목 중 해당 유저 id 가 있는지 확인 후 반환
            if (response.data && response.data.length > 0) {
                return response.data;
              } else{
                console.log("요청 오류");
                return null;
              }
        } catch (error) {
        console.error(`vote_record 데이터 오류 ${voteId}:`, error);
        return null;  
        }
    };

    // 투표 만든사람 정보
    const VotingBySend = (responseArray) => {
        const token = localStorage.getItem("token");
        const requests = responseArray.map((item) =>
          axios({
            url: `${API_URL}/api/user/projects/votingByUser`,
            headers: { Authorization: `Bearer ${token}` },
            method: "post",
            params: { userId: item.createdUser },
          })
        );
    
        Promise.all(requests)
          .then((responses) => {
            const userData = {};
            responseArray.forEach((item, index) => {
              userData[item.id] = responses[index].data;
            });
            setVotingByUser(userData);
          })
          .catch((error) => {
            console.error("Error fetching voting creators:", error);
          });
      };

    

    // 각 투표 별 정보 조회 handler(1. 기본 투표 정보  2.투표 항목 )
    const handler = async () => {
    const votingResponse = await Send(); // 1
 

        if (votingResponse && votingResponse.length > 0) {
        const allContents = {};

        for (const vote of votingResponse) {
            const contents = await contentsSend(vote.id); // 2
           
            allContents[vote.id] = contents;
            const userVoteContents = await userVoteSend(vote.id); // 3(유저의 투표한 정보 불러오기) // 투표 별
           
        if (userVoteContents !== null) {
            // 만약 투표를 한 유저면,
          setUserVotes(prev => ({
            ...prev,
            [vote.id]: {contentsId:userVoteContents[1], voteId:userVoteContents[0] }
          }));
          await optionSend(vote.id); 
        }   
      }
        setContentsData(allContents);
        }
    };

    // (투표 후) 사용자 투표 항목 저장 요청
    function userVote(voteId) {
        const token = localStorage.getItem('token');
        axios({
        url: `${API_URL}/api/user/projects/uservoteinsert`,
        headers: { 'Authorization': `Bearer ${token}` },
        method: 'post',
        params: { votingId: voteId, contentsId: state, userId: userId }, // 투표 고유 id, 투표 항목 id, 사용자id
        }).then(function (response) {
            console.log(response);
        });
    }

    // (투표 후) 항목들에 대한 유저들의 투표 정보들
    const optionSend = async (voteId) => {         
      const token = localStorage.getItem('token');         
      try {             
          const response = await axios({                 
              url: `${API_URL}/api/user/projects/VoteOptionUsers`,                 
              headers: { 'Authorization': `Bearer ${token}` },                 
              method: 'post',                 
              params: { votingId: voteId , projectId:projectData.id},             
          });             
          const voteCounts = response.data.reduce((acc, item) => {
            acc[item.contentsId] = item.userCount;
            return acc;
          }, {});
      
          setVoteResults((prev) => ({
            ...prev,
            [voteId]: voteCounts,
          }));
      
        } catch (error) {
          console.error(` ${voteId}:`, error);
        }
      };

    
    const modalHandler = () => {
        console.log("새 투표 버튼 누름");
        setModalShow(true);
    
    }

   // 투표 종료 handler(idVote 값 false 로 변경)
    function endHandler(voteId){ 
      let result = window.confirm("투표를 종료하시겠습니까?");
      
      if(result){
        const token = localStorage.getItem('token');
      axios({
      url: `${API_URL}/api/user/projects/isVoteUpdate`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { votingId: voteId }, // 투표 고유 id
      }).then(function (response) {
          setIdVoteState(true);
          alert("투표가 종료되었습니다 !");
       
      });
      }else{
        return;
      }

    }

    function handleCheckboxChange(e, voteId, contentId) {
      setState(contentId); 
  
    
      const voteButton = document.querySelector(`#vote-button-${voteId}`);
      voteButton.disabled = !e.target.checked;
  }
  

  function handleSubmittt(e, voteId) {
    e.preventDefault();

    const checkboxes = document.querySelectorAll(`[name="vote-${voteId}"]`);
    const selected = Array.from(checkboxes).find((box) => box.checked);

    if (!selected) {
        alert("항목을 선택해주세요!"); 
        return;
    }

    checkboxes.forEach((box) => (box.disabled = true));

    const voteButton = document.querySelector(`#vote-button-${voteId}`);
    voteButton.disabled = true; 

    userVote(voteId); 
    localStorage.setItem('userVote_' + voteId, JSON.stringify({ voteId, contentId: selected.value }));
    
    handler(voteId);
    optionSend(voteId); 

    alert("투표가 완료되었습니다!"); 
}

  
  return (
    <>
    <div className="voteheader">
    <h3><FontAwesomeIcon icon={faCheckToSlot} style={{fontSize:"20px"}}/></h3>
      <h1>투표</h1>
      <button className="votingButton" onClick={modalHandler}> <FontAwesomeIcon icon={faPenToSquare} /></button>
      </div>
      {modalShow && (
        <NewVoting
          setModalShow={setModalShow}
          modalShow={modalShow}
          handler={handler}
          updateVotingList={updateVotingList}
          setRere={setRere}
          rere={rere}
        />
      )}
      <div className="voting-container">
        {Array.isArray(votingData) &&
          votingData.map((vote) => {
            const isEnded = !!vote.votingEnd; // 종료 여부 확인
            const today = new Date();
            const endTime = new Date(vote.votingEnd);
            const daysRemaining = Math.ceil((endTime - today) / (1000 * 60 * 60 * 24)); 
            return (
              <section key={vote.id} className="voting-card">
                <div className="vote-status">
              
              {vote.vote ? (
                <h3 style={{ color: "red" }}>진행중</h3>
                
              ) : (
                <h3 style={{ color: "gray" }}>투표 종료</h3>
              )}
              {!isEnded && userId === vote.createdUser && (
                <button  className="votingButton2" onClick={() => endHandler(vote.id)}>종료</button>
              )}
              <div className="vote-name-container">
                  {isEnded && daysRemaining == 0 ? 
                  <p style={{color:"red"}}><strong>오늘 마감되는 투표입니다 !</strong></p>
                  :
                  (
                    isEnded && <p className="end-time" style={{color:"red"}}>
                      마감일  :  {new Date(vote.votingEnd).toLocaleString()}
                    </p>
                  )}
            </div>
            
                </div>
                <div className="voting-header">
                 
                  <img
                src={votingByUser[vote.id]?.profileImageUrl || defaultImage}
                alt={`${votingByUser[vote.id]?.username || "사용자"}의 프로필 이미지`}
                onClick={() => toggleProfileModal(vote.id)}
                className="profile-img"
                style={{ position: "relative" }} /* 추가: 상대 위치 지정 */ />
                  {activeProfile === vote.id && votingByUser[vote.id] && (
              <div className="user-info-dropdown">
              <p>이름: {votingByUser[vote.id]?.username || "정보 없음"}</p>
              <p>이메일: {votingByUser[vote.id]?.email || "정보 없음"}</p>
              <p>회사명: {votingByUser[vote.id]?.company || "정보 없음"}</p>
              <p>직급: {votingByUser[vote.id]?.position || "정보 없음"}</p>
              <p>핸드폰 번호: {votingByUser[vote.id]?.phone || "정보 없음"}</p>
              <p>fax: {votingByUser[vote.id]?.fax || "정보 없음"}</p>
            </div>
          )}

                  <h5>
                    <div className="votingByUser">
                      {votingByUser[vote.id]?.username || "정보 없음"}
                    </div>
                  </h5>
                  <p className="date">
                    {new Date(vote.createdAt).toLocaleDateString()}{" "}
                    <FontAwesomeIcon icon={faUsers} />
                  </p>
                  {userVotes[vote.id] ? (
                    <FontAwesomeIcon icon={faCheck} style={{ color: "blue" }} className="check" />
                  ) : (
                    <FontAwesomeIcon icon={faCheck} style={{ color: "red" }} className="check" />
                  )}
                </div>
                <h3 className="vote-name">{vote.votingName}</h3>


                
                <span className="vote-detail">{vote.votingDetail}</span>
                <div className="separator"></div>
                <ul>
    {Array.isArray(contentsData[vote.id]) && contentsData[vote.id].length > 0 ? (
        <form onSubmit={(e) => handleSubmittt(e, vote.id)}>
            {contentsData[vote.id].map((content, idx) => {
                const isVoted = userVotes[vote.id]?.contentsId === content.id;
                const voteCount = voteResults[vote.id]?.[content.id] || 0;

                const isVotingActive = vote.vote && (!vote.votingEnd || new Date(vote.votingEnd) > new Date());
                const isVotingEnded = !isVotingActive;

                return (
                    <div key={idx} className="vote-item">
                        <label
                            className="vote-option"
                            style={{ color: isVoted ? "red" : "black" }}
                        >
                            <input
                                type="radio"
                                name={`vote-${vote.id}`}
                                value={content.id}
                                disabled={isVotingEnded || !!userVotes[vote.id]} 
                                onChange={(e) => handleCheckboxChange(e, vote.id, content.id)}
                                className="custom-checkbox"
                            />
                            <span className="checkbox-label">
                                {content.votingContents}
                            </span>
                            {voteCount > 0 && (
                                <span className="vote-count">({voteCount} 명 투표)</span>
                            )}
                        </label>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${(voteCount / (totalVotes[vote.id] || 1)) * 100}%`,
                                    backgroundColor: isVoted ? "red" : "gray",
                                }}
                            ></div>
                        </div>
                    </div>
                );
            })}
            {vote.vote && (
                <button
                    type="submit"
                    id={`vote-button-${vote.id}`}
                    // disabled={!state}
                    className="arrow-button"
                >
                    투표하기
                </button>
            )}
        </form>
    ) : (
        <p>내용이 없습니다.</p>
    )}
</ul>

                      </section>
                    );
                  })}
              </div>
            </>
          ); 
          }

    export default ShowVoting;