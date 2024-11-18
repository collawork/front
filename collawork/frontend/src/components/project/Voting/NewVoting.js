import React, {useRef, useState } from "react";
import ReactModal from "react-modal";
import axios from 'axios';
import {projectStore} from '../../../store';
import { useUser } from '../../../context/UserContext';
import ShowVoting from './ShowVoting';


    // -- 고민 해볼것들 --  
    // 1. 투표 결과 공개 시점 (실시간/투표종료 후)
    // 2. 복수 투표
    // 3. 익명 투표
    // 4. 투표 결과 나만 보기 

const API_URL = process.env.REACT_APP_API_URL;
const Voting = () => {

    const [show, setShow] = useState(false);
    const [title, setTitle] = useState(""); // 투표 제목
    const [context, setContext] = useState(""); // 투표 설명
    const { userId } = useUser();
    const nextID = useRef(1);
    const {projectData} = projectStore(); 
    const [inputItems, setInputItems] = useState([{id:0, voteOption: ''}]); // id 와 배열 담을 변수

    const onClickVotingHandler = () => {
        setShow(true);
    }

    // 투표 항목 추가
    function addInput(){ 
        const input={
            id: nextID.current,
            voteOption:''
        };

        setInputItems([...inputItems, input]);
        nextID.current += 1; 
    }

    // 추표 항목 삭제
    function deleteInput(index){
        setInputItems(inputItems.filter(item => item.id !== index));
        // 인덱스 값과 같지 않은 애들 남김
    }

    function handleChange(e, index){

        if(index > inputItems.length) return; 

        const inputItemsCopy = JSON.parse(JSON.stringify(inputItems));
        inputItemsCopy[index].voteOption = e.target.value;
        setInputItems(inputItemsCopy);
    }

    const cancleHandler = () => {
        setShow(false);
        setTitle('');
        setContext('');
        setInputItems([{ id: 0, voteOption: '' }]);
        nextID.current = 1;
    }

    function send(){ // voting insert 요청
        const token = localStorage.getItem('token');
        const userIdValue = typeof userId === 'object' && userId !== null ? userId.userId : userId;
        axios({
            url: `${API_URL}/api/user/projects/newvoting`,
            headers: { 'Authorization': `Bearer ${token}` },
            method: 'post',
            params: { votingName:title, projectId:projectData.id, createdUser:userIdValue },
            baseURL: 'http://localhost:8080',
            withCredentials: true,
        }).then(function(response) {

            console.log("newVoting : " + response);
            console.log("newVoting : " + response.data);
        });

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log( title, context, inputItems);
        console.log(title);
        send();
     
    }



    return(
        <>
        <ReactModal
                isOpen={show}
                contentLabel="new voting modal"
                appElement={document.getElementById('root')}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        borderRadius: 0,
                        border: "none",
                        padding: '20px',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    }
                }}
            >
            <form onSubmit={handleSubmit}>
            <input placeholder="제목을 입력하세요." type="text" value={title} onChange={(e) => setTitle(e.target.value)} required/>
            <br/>
            {/* <br/>
            <input placeholder="투표에 관한 설명 입력" value={context} onChange={(e) => setContext(e.target.value)} required /> */}
            <br/>
            <br/>
            {inputItems.map((item, index) => ( <>
             <label key={index}>
             <div>항목{index}</div>
             <input type="text" className={`title-${index}`} 
                     onChange={(e) => handleChange(e, index)} value={inputItems.voteOption}/>
             {index === 0 && inputItems.length < 30 && (
                 <button type="button" onClick={addInput}> + </button>
             )}
 
             {index > 0  ? (
                 <button type="button" onClick={() => deleteInput(item.id)}> - </button>
             ):(
                 ''
             )}
             </label>
          </>))}
                <br/>
                <br/>
                <label>투표 마감일</label>
                <input type="date" />
                <br/>
                <br/>
                <button type="submit">저장</button>
          </form>
         <button onClick={cancleHandler}>취소</button>
         

           </ReactModal>

            <h3>투표 페이지</h3>
            <button onClick={onClickVotingHandler}>+ 새 투표</button>
            <ShowVoting/>

        </>
        

    )



}
export default Voting;