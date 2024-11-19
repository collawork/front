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

    const handler = async () => {  
        const votingResponse = await Send();  

        if (votingResponse && votingResponse.length > 0) {  
            const allContents = {};  
            for (const vote of votingResponse) {  
                const contents = await contentsSend(vote.id);  
                allContents[vote.id] = contents;  
            }  
            setContentsData(allContents);  
        }  
    };  

    function userVote(){ // 사용자 vote 정보 저장
      const token = localStorage.getItem('token');  
      axios({
        url: `${API_URL}/api/user/projects/uservoteinsert`,
        headers: { 'Authorization': `Bearer ${token}` },
        method: 'post',
        params: { votingId:projectData.id, contentsId:state, userId:userId }, // 투표 고유 id, 투표 항목 id, 사용자id
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
