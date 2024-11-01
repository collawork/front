import { useNavigate } from 'react-router-dom';

const Project = () => {

    const nevi = useNavigate();
    return(
        <>
        <h1> 프로젝트 명</h1>
        <button onClick ={nevi("/login")}>돌아가기</button>
        </>
    )
}
export default Project;