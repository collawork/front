import { useState } from "react";

const NewProject = ({setNewProjectShow}) => {

    // 새로운 프로젝트 양식 작성 부분
    const [show, setShow] = useState(false);

    const onClickHandler = () => {
        setShow(true);
    }


    return(
        <>

        <h2>프로젝트 만들기</h2>
        <input type="text" name="title" placeholder="제목을 입력하세요" required/>
        <button onClick={onClickHandler}>설명입력</button>
        {setShow && <input type="textarea" name="text" placeholder="프로젝트에 관한 설명 입력(옵션)"/>}
        <button onClick={()=>setShow(false)}>닫기</button>
        {/* 프로젝트 생성일, 프로젝트 코드, 관리자 변경 */}

        </>
    )
};
export default NewProject;