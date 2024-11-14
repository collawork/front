import { useState,useEffect } from "react";
import axios from 'axios';
import ReactModal from "react-modal";

const Voting = () => {

    // const [show, setShow] = useState(false);
    // const [title, setTitle] = useState(); // 투표 제목

    // const onClickVotingHandler = () => {
    //     setShow(true);
    // }

    // const handleSubmit = () => {
        
    // }

    return(
        <>
            {/* <ReactModal
                isOpen={show}
                contentLabel="새 프로젝트"
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
                <input placeholder="제목을 입력하세요." type="text" value={title}></input>
                {/* <input placeholder="투표에 관한 설명 입력 (옵션)" value={content}></input> */}
                {/* <input placeholder="항목 추가"></input>
                <button onClick={}>+ 투표 항목 추가</button>
                <date>투표 마감일</date>
                

                </form>
                 */}

            {/* // </ReactModal> */} */

            {/* <button onClick={onClickVotingHandler}>+ 새 투표</button> */}
            <h3>투표 ~!</h3>
                
        </>

    )
}
export default Voting;