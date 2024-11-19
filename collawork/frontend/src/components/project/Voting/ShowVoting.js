import { useState } from 'react';  
import NewVoting from '../Voting/NewVoting';  
import { projectStore } from '../../../store';  
import axios from 'axios';  

const API_URL = process.env.REACT_APP_API_URL;  

const VotingList = () => {  
    const [votingData, setVotingData] = useState([]);  
    const [contentsData, setContentsData] = useState({}); // Store contents by votingId  
    const [modalShow, setModalShow] = useState(false);  
    const { projectData } = projectStore();  

    // Fetch voting data
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
            console.error("Error fetching voting data:", error);  
        }  
    };  

    // Fetch contents data for a specific votingId
    const contentsSend = async (votingId) => {  
        try {  
            const token = localStorage.getItem('token');  
            const response = await axios({  
                url: `${API_URL}/api/user/projects/findContents`,  
                headers: { 'Authorization': `Bearer ${token}` },  
                params: { votingId },  
                method: 'post',  
            });  
            return response.data;  
        } catch (error) {  
            console.error(`Error fetching contents for votingId ${votingId}:`, error);  
            return []; // Return an empty array on failure
        }  
    };  

    // Fetch both voting data and contents for each votingId
    const handler = async () => {  
        try {  
            const votingResponse = await Send();  

            if (votingResponse && votingResponse.length > 0) {  
                const allContents = {};  
                // Fetch contents for each votingId
                for (const vote of votingResponse) {  
                    const contents = await contentsSend(vote.id);  
                    allContents[vote.id] = contents; // Store contents by votingId
                }  
                setContentsData(allContents);  
            } else {  
                console.log("No voting data available");  
            }  
        } catch (error) {  
            console.error("Error in handler:", error);  
        }  
    };  

         const onClickHandler = (e) => {
          console.log(e.target.value);
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
                                    <form>  
                                        {contentsData[vote.id].map((content, idx) => (  
                                            <div key={idx} style={{ marginBottom: '8px' }}>  
                                                <label>  
                                                    <input  
                                                        type="radio"  
                                                        name={`vote-${vote.id}`} 
                                                        value={content.id} 
                                                        style={{ marginRight: '8px' }}  
                                                    />  
                                                    {content.votingContents}  
                                                </label>  
                                            </div>  
                                        ))}  
                                    </form>  
                                ) : (  
                                    <p>내용이 없습니다.</p>  
                                )}  
                            </li>  
                        </ul>  
                        <br/>
                        <br/>
                        <button onClick={(e)=> onClickHandler}>투표하기</button>
                    </section>  
                ))}  
            </div>  
        </>  
    );  
};  

export default VotingList;
