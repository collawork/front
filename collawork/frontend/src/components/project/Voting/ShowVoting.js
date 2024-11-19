import { useState } from 'react';  
import NewVoting from '../Voting/NewVoting';  
import { projectStore } from '../../../store';  
import axios from 'axios';  
import { useUser } from '../../../context/UserContext';

const API_URL = process.env.REACT_APP_API_URL;  

const VotingList = () => {  
    const [votingData, setVotingData] = useState([]);  
    const [contentsData, setContentsData] = useState({});  
    const [modalShow, setModalShow] = useState(false);  
    const { projectData } = projectStore();  
    const [state, setState] = useState();  
    const { userId } = useUser();

    // 프로젝트에 귀속된 투표 list 조회 요청
    const Send = async () => {  
        try {  
            const token = localStorage.getItem('token');  
            const response = await axios({  
                url: `${API_URL}/api/user/projects/findVoting`,  
                headers: { 'Authorization': `Bearer ${token}` },  
                params: { projectId: projectData.id },  
                method: 'post',  
            });  
            setVotingData(response.data);  
            return response.data;  
        } catch (error) {  
            console.error("vote 데이터 오류:", error);  
        }  
    };  

    // 프로젝트에 귀속된 투표들의 각각 항목 조회 요청
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
            console.error(`vote contents 데이터 오류 ${votingId}:`, error);  
            return [];  
        }  
    };  

    // user 의 투표 항목 정보 조회 // 클릭 한 그 voting_id 를 가지고 와야댐
    const userVoteSend = async (votingId) => {  
      try {  
          const token = localStorage.getItem('token');  
          const response = await axios({  
              url: `${API_URL}/api/user/projects/findUserVoting`,  
              headers: { 'Authorization': `Bearer ${token}` },  
              params: {votingId:votingId, userId:userId},  
              // 투표 아이디와 해당 유저의 id 를 보냄-> 투표 항목 중 해당 유저 id 가 있는지 확인 후 반환
              method: 'post',  
          });  
          return response.data;  
      } catch (error) {  
          console.error(`vote contents 데이터 오류 ${votingId}:`, error);  
          return [];  
      }  
  };  

  // 각 투표 별 정보 조회 handler(1. 기본 투표 정보  2.투표 항목  3. 유저의 투표 항목(투표별) )
    const handler = async () => {  
        const votingResponse = await Send();  // 1

        if (votingResponse && votingResponse.length > 0) {  
            const allContents = {};  
            for (const vote of votingResponse) {  
                const contents = await contentsSend(vote.id); // 2
                allContents[vote.id] = contents;  
                const userVoteContents = await userVoteSend(vote.id); // 3(유저의 투표 한 정보 불러오기)// 투표 별
                console.log(userVoteContents);
            }  
            setContentsData(allContents);  
        }  
    };  

   
     // (투표 후) 사용자 투표 항목 저장 요청 // 클릭한 그 투표의 값을 가지고 와야겠다.. ㅠㅠ
    function userVote(){
      const token = localStorage.getItem('token');  
      axios({
        url: `${API_URL}/api/user/projects/uservoteinsert`,
        headers: { 'Authorization': `Bearer ${token}` },
        method: 'post',
        params: { votingId:votingData.id, contentsId:state, userId:userId }, // 투표 고유 id, 투표 항목 id, 사용자id
        baseURL: 'http://localhost:8080',
      }).then(function(response) {
        console.log(response);
      })};

      
      const handleSubmit = (e) => {  
        e.preventDefault(); 
        console.log("선택 option:", state);  
        alert("투표가 완료되었습니다!");  
        userVote();
    };  

    return (  
        <>  
            <h3>투표 페이지</h3>  
            <button onClick={() => setModalShow(true)}>+ 새 투표</button>  
            <button onClick={handler}>list 보기</button>  
            {modalShow && <NewVoting setModalShow={setModalShow} />}  

            <div>  
                {Array.isArray(votingData) && votingData.map((vote) => (  
                    <section key={vote.id}>  
                        <h3>투표 이름: {vote.votingName}</h3>  
                        <h5>- {vote.votingDetail}</h5>
                        <ul style={{ listStyleType: "none", padding: 0 }}>  
                            <li><strong>ID:</strong> {vote.id}</li>  
                            <li><strong>작성자:</strong> {vote.createdUser}</li>  
                            <li>작성일: {new Date(vote.createdAt).toLocaleDateString()}</li>  
                            <li>  
                                <strong>투표 항목:</strong>  
                                {Array.isArray(contentsData[vote.id]) && contentsData[vote.id].length > 0 ? (  
                                 <form onSubmit={handleSubmit}>  
                                 {contentsData[vote.id].map((content, idx) => (  
                                  <div key={idx} style={{ marginBottom: '8px' }}>  
                                   <label>  
                                   <input  
                                      type="radio"  
                                      name={`vote-${vote.id}`}  
                                      onChange={(e) => setState(e.target.value)}  
                                      value={content.id}  
                                      style={{ marginRight: '8px' }}  
                                       />  
                                      {content.votingContents}  
                                      </label>  
                                      </div>  
                                        ))}  
                                        <button type="submit">투표하기</button>  
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

export default VotingList;
