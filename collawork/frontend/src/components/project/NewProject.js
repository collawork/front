import { useState } from "react";
import ReactModal from "react-modal";


const NewProject = ({setNewProjectShow}) => {

    // 새로운 프로젝트 양식 작성 부분
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");
    



    const [textShow, setTextShow] = useState(false);
    const [selectShow, setSelectShow] = useState(false);
    const [modalShow1, setModalShow1] = useState(true);
    const [newShow, setNewShow] = useState(true);

    const onClickHandler = (e) => {
        setTextShow(true);
        setTitle(e.target.value);
    }

    const selectHandler = () => {
        setSelectShow(true);
    }

    const closeModal = () => {
        setNewShow(false);
    }

    const modalCloseHandler = () => {
        setNewProjectShow(false);
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
        {textShow&&<input type="textarea" name="text"/>}

        <input type="date" name="date">프로젝트 시작일 지정</input>
        {/* 시간되면.. 참석자 추가도.. */}
        <button onClick={modalCloseHandler}>프로젝트 생성</button>
        

        </ReactModal>
        </>
    )
};
export default NewProject;