import { useState } from "react";
import ReactModal from "react-modal";

const NewProject = ({setNewProjectShow}) => {

    // 새로운 프로젝트 양식 작성 부분
    const [textShow, setTextShow] = useState(false);
    const [newShow, setNewShow] = useState(true);

    const onClickHandler = () => {
        setTextShow(true);
    }

    const closeModal = () => {
        setNewShow(false);
    }


    return(
          <>
            <ReactModal
                isOpen={newShow}
                contentLabel="새 프로젝트"
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
                        padding: 0,
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)' 
                    }
                }}
            >

        <h2>프로젝트 만들기</h2>
        <input type="text" name="title" placeholder="제목을 입력하세요" required/>
        <button onClick={onClickHandler}>설명입력</button>
        {/* {setShow && <input type="textarea" name="text" placeholder="프로젝트에 관한 설명 입력(옵션)"/>}
        <button onClick={()=>setShow(false)}>닫기</button>
        {/* 프로젝트 생성일, 프로젝트 코드, 관리자 변경 */}
         
        </ReactModal>
        </>
    )
};
export default NewProject;