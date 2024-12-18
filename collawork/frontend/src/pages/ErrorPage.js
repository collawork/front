import {useNavigate} from "react-router-dom";
import "../components/assest/css/ErrorPage.css";


const ErrorPage = () => {

    const navigator = useNavigate();

    const onClickBackToHome =()=>{
        navigator("/");
    }

    return(
        <div className="container-err">
            <div className="text-container-err">
                {/* <h1 className="title">유효하지 않은 URL 주소<br />404 ERROR<br /></h1> */}
                <h1 className="title-err">404 ERROR<br />유효하지 않은 URL 주소<br /></h1>
                <p className="subtitle-err">페이지를 찾을 수 없습니다</p>
                <button className="button-err" onClick={onClickBackToHome}>돌아가기</button>
            </div>
            <div className="image-container-err">
               
            </div>
        </div>
    
    )
}

export default ErrorPage;