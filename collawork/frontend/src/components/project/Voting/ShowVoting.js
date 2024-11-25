import { useState, useEffect,useRef } from 'react';
import NewVoting from '../Voting/NewVoting';
import { projectStore } from '../../../store';
import defaultImage from '../../../components/assest/images/default-profile.png';
import '../../assest/css/UserInfoModal.css';
import axios from 'axios';
import { useUser } from '../../../context/UserContext';

const API_URL = process.env.REACT_APP_API_URL;

const ShowVoting = () => {
    const modalRef = useRef();
    const [idVoteState, setIdVoteState] = useState(false);
    const [activeProfile, setActiveProfile] = useState(null);
    const [profileModal, setProfileModal] = useState({ visible: false, position: {}, user: null });
    const [votingData, setVotingData] = useState([]);
    const [contentsData, setContentsData] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const { projectData } = projectStore();
    const [state, setState] = useState();
    const { userId } = useUser();
    const [userVotes, setUserVotes] = useState({}); // 각 투표별로 상태를 관리하기 위한 상태 객체 추가
    const [voteResults, setVoteResults] = useState([{}]);
    const [votingByUser, setVotingByUser] = useState([]);
    const toggleProfileModal = (id) => {
      setActiveProfile((prev) => (prev === id ? null : id)); 
    };
    

    useEffect(() => {
        if(userId){
            handler();
        }
        }, [modalShow, userId,idVoteState ]);

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
      
          console.log(`Vote results for ${voteId}:`, voteCounts);
        } catch (error) {
          console.error(`Error fetching vote results for ${voteId}:`, error);
        }
      };


    // 투표하기! 를 누른 후 handlerSubmit
    const handleSubmit = (e, voteId) => {
        e.preventDefault();

         // 투표를 한 사용자가 다시 투표하기 버튼을 누른다면
       
        console.log('투표한 vote.id:', voteId); // 투표하기를 누른 voteId
        console.log("선택 option:", state); // 투표할 항목인 contentsId
        userVote(voteId); // 투표 항목 저장

        localStorage.setItem('userVote_' + voteId, JSON.stringify({ voteId, contentId: state }));

        handler(voteId); 
        // optionSend(voteId); // 다른 유저들의 투표정보들 까지도 불러옴
        alert("투표가 완료되었습니다!");
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
          />
        )}
  
        <div>
          {Array.isArray(votingData) &&
            votingData.map((vote) => (
              <section key={vote.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                    position: "relative",
                  }}
                >
                  <img
                    src={votingByUser[vote.id]?.profileImageUrl || defaultImage}
                    alt={`${votingByUser[vote.id]?.username || "사용자"}의 프로필 이미지`}
                    onClick={() => toggleProfileModal(vote.id)} 
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                  />
                  <h5>
                    생성자 : {votingByUser[vote.id]?.username || "정보 없음"}{" "}
                    {/* ({votingByUser[vote.id]?.email || "이메일 없음"}) */}
                  </h5>
                  {activeProfile === vote.id && votingByUser[vote.id] && (
                    <div
                      className="user-info-dropdown"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "60px",
                        transform: "translateY(-50%)",
                        zIndex: 1000,
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "10px",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
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
                </div>
                <h3>투표 이름: {vote.votingName}</h3>
                <h5>- {vote.votingDetail}</h5>    
                {console.log(vote)}             
                {console.log(vote.isVote)}
                {console.log(vote.votingName)}
                {vote.vote == true?          
                <div>        
                <h3 style={{color:"blue"}}>진행중</h3>
                {userId === vote.createdUser? <button onClick={()=> endHandler(vote.id)}>진행종료</button>:null}                 
                </div>
                :                
                 <h3 style={{color:"gray"}}>투표 종료</h3>                 
                 }
                <ul>
                  <li>작성일: {new Date(vote.createdAt).toLocaleDateString()}</li>
                  <li>
                    <strong>투표 항목:</strong>
                    {Array.isArray(contentsData[vote.id]) && contentsData[vote.id].length > 0 ? (
                      <form onSubmit={(e) => handleSubmit(e, vote.id)}>
                        {contentsData[vote.id].map((content, idx) => {
                          const isVoted = userVotes[vote.id]?.contentsId === content.id;
  
                          const voteCount = voteResults[vote.id]?.[content.id] || 0;
  
                          return (
                            <div key={idx} style={{ marginBottom: "8px" }}>
                              <label style={{ color: isVoted ? "red" : "black" }}>
                                <input
                                  type="radio"
                                  name={`vote-${vote.id}`}
                                  onChange={(e) => setState(e.target.value)}
                                  value={content.id}
                                  disabled={!!userVotes[vote.id]}
                                  style={{ marginRight: "8px" }}
                                />
                                {content.votingContents}
                                {voteCount > 0 && (
                                  <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                                    ({voteCount} 명 투표)
                                  </span>
                                )}
                              </label>
                            </div>
                          );
                        })}
                        <button
                          type="submit"
                          disabled={!!userVotes[vote.id]}
                          style={{
                            backgroundColor: !!userVotes[vote.id] ? "gray" : "#007bff",
                            color: "white",
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: !!userVotes[vote.id] ? "not-allowed" : "pointer",
                          }}
                        >
                          투표하기
                        </button>
                      </form>
                    ) : (
                      <p>내용이 없습니다.</p>
                    )}
                  </li>
                </ul>
                <br />
                <br />
              </section>
            ))}
        </div>
      </>
    );
  };
    
    export default ShowVoting;