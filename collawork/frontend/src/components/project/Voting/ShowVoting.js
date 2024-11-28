import React, { useState, useEffect } from "react";

import NewVoting from '../Voting/NewVoting';
import { projectStore } from '../../../store';
import defaultImage from '../../../components/assest/images/default-profile.png';
import '../../assest/css/UserInfoModal.css';
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import '../../../components/assest/css/ShowVoting.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUsers} from "@fortawesome/free-solid-svg-icons";


const API_URL = process.env.REACT_APP_API_URL;

const ShowVoting = () => {
    // const modalRef = useRef();
    const [idVoteState, setIdVoteState] = useState(false);
    const [activeProfile, setActiveProfile] = useState(null);
    // const [profileModal, setProfileModal] = useState({ visible: false, position: {}, user: null });
    const [votingData, setVotingData] = useState([]);
    const [contentsData, setContentsData] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const { projectData } = projectStore();
    const [rere, setRere] = useState();
    const [state, setState] = useState();
    const { userId } = useUser();
    const [userVotes, setUserVotes] = useState({}); // 각 투표별로 상태를 관리하기 위한 상태 객체 추가
    const [voteResults, setVoteResults] = useState([{}]);
    const [votingByUser, setVotingByUser] = useState([]);
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
    console.log("Voting data:" + votingResponse);
    // VotingBySend(); // 1-1 만든사람 정보
    // setVotingData(votingData);

        if (votingResponse && votingResponse.length > 0) {
        const allContents = {};

        for (const vote of votingResponse) {
            const contents = await contentsSend(vote.id); // 2
            console.log(contents);
            allContents[vote.id] = contents;
            const userVoteContents = await userVoteSend(vote.id); // 3(유저의 투표한 정보 불러오기) // 투표 별
           
            console.log(userVoteContents);
          
            console.log(votingData);

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
      
          console.log(`${voteId}:`, voteCounts);
        } catch (error) {
          console.error(` ${voteId}:`, error);
        }
      };

    
    const modalHandler = () => {
        console.log("새 투표 버튼 누름");
        setModalShow(true);
        console.log(modalShow);
    }

   // 투표 종료 handler(idVote 값 false 로 변경)
    function endHandler(voteId){ 
      let result = window.confirm("투표를 종료하시겠습니까?");
      
      if(result){
        const token = localStorage.getItem('token');
      console.log(voteId)
      axios({
      url: `${API_URL}/api/user/projects/isVoteUpdate`,
      headers: { 'Authorization': `Bearer ${token}` },
      method: 'post',
      params: { votingId: voteId }, // 투표 고유 id
      }).then(function (response) {
          setIdVoteState(true);
          alert("투표가 종료되었습니다 !");
          console.log(response);
          console.log(response.data)
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
  
      console.log(`Voted for content ID: ${selected.value}`);
  
  
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
        <h3>투표 페이지</h3>
        <button onClick={modalHandler}>+ 새 투표</button>
        {modalShow && (
          <NewVoting
            setModalShow={setModalShow}
            modalShow={modalShow}
            handler={handler}
            handleModalClose={handleModalClose}
            setRere={setRere}
            rere={rere}
          />
        )}
        <div className="voting-container">
          {Array.isArray(votingData) &&
            votingData.map((vote) => (
              <section key={vote.id} className="voting-card">
  <div className="voting-header">
    <img
      src={votingByUser[vote.id]?.profileImageUrl || defaultImage}
      alt={`${votingByUser[vote.id]?.username || "사용자"}의 프로필 이미지`}
      onClick={() => toggleProfileModal(vote.id)}
      className="profile-img"
    />
    <h5>
      <div className="votingByUser">
        {votingByUser[vote.id]?.username || "정보 없음"}
      </div>
    </h5>
    <p className="date">
      {new Date(vote.createdAt).toLocaleDateString()}{" "}
      <FontAwesomeIcon icon={faUsers} />
    </p>
  </div>
                {vote.vote === true ? (
                  <div className="vote-status">
                    <h3 style={{ color: "red" }}>진행중</h3>
                    {userId === vote.createdUser && (
                      <button onClick={() => endHandler(vote.id)}>진행종료</button>
                    )}
                    <div className="vote-name-container">
                      <h3 className="vote-name">{vote.votingName}</h3>
                    </div>
                  </div>
                ) : (
                  <h3 style={{ color: "gray" }}>투표 종료</h3>
                )}
                {activeProfile === vote.id && votingByUser[vote.id] && (
                  <div
                  className="user-info-dropdown"
                  style={{
                    position: 'absolute',
                    left: '50%', 
                    top: '0',   
                    transform: 'translateX(100%)',
                    zIndex: 1000, 
                  }}
                >
                    <p>이름: {votingByUser[vote.id]?.username || "정보 없음"}</p>
                    <p>이메일: {votingByUser[vote.id]?.email || "정보 없음"}</p>
                    <p>회사명: {votingByUser[vote.id]?.company || "정보 없음"}</p>
                    <p>직급: {votingByUser[vote.id]?.position || "정보 없음"}</p>
                    <p>핸드폰 번호: {votingByUser[vote.id]?.phone || "정보 없음"}</p>
                    <p>fax: {votingByUser[vote.id]?.fax || "정보 없음"}</p>
                  </div>
                )}
                
                  <span className="vote-detail">{vote.votingDetail}</span>
                  <div className="separator"></div>
                
                <ul>
                {Array.isArray(contentsData[vote.id]) && contentsData[vote.id].length > 0 ? (
   <form onSubmit={(e) => handleSubmittt(e, vote.id)}>
   {contentsData[vote.id].map((content, idx) => {
     const isVoted = userVotes[vote.id]?.contentsId === content.id; 
     const voteCount = voteResults[vote.id]?.[content.id] || 0;
        

     return (
      <div key={idx} className="vote-item">
        <label className="vote-option" style={{ color: isVoted ? "red" : "black" }}>
          <input
            type="checkbox"
            name={`vote-${vote.id}`}
            value={content.id}
            disabled={!!userVotes[vote.id]} 
            onChange={(e) => handleCheckboxChange(e, vote.id, content.id)}
            className="custom-checkbox"
          />
          <span className="checkbox-label">{content.votingContents}</span>
          {voteCount > 0 && <span className="vote-count">({voteCount} 명 투표)</span>}
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
  <button
    type="submit"
    id={`vote-button-${vote.id}`}
    disabled={true} 
    className="vote-button"
  >
    투표하기
  </button>
</form>
  ) : (
    <p>내용이 없습니다.</p>
  )}
</ul>
              </section>
            ))}
        </div>
      </>
    );
    
}

    export default ShowVoting;