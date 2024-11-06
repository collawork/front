import { useState } from 'react'; 
import ReactModal from "react-modal"; 
import ProjectService from "../services/ProjectService"; 

const Aside = () => {  
   
    const [formData, setFormData] = useState({ 
        title: "", 
        context: "" 
    });

    const [newShow, setNewShow] = useState(false); 

    
    const modalCloseHandler = () => { 
        setNewShow(false); 
        setFormData({ title: "", context: "" }); 
    };

    const handleSubmit = async (e) => { 
        e.preventDefault(); 

        if (!formData.title) {
            alert("프로젝트의 이름을 입력해주세요.");
            return;
        }
        try {
            await ProjectService.newProjctInsert(formData);
            alert('새 프로젝트가 생성되었습니다.');
            setNewShow(false);
        } catch (error) {
            alert('프로젝트 생성에 실패하였습니다.');
        }
    };

   
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <>  
            <ReactModal 
                isOpen={newShow} 
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
                <h2>프로젝트 만들기</h2> 
                <form onSubmit={handleSubmit}> 
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="제목을 입력하세요" 
                        onChange={handleInputChange} 
                        value={formData.title} 
                        required 
                    /> 
                    <textarea 
                        name="context" 
                        placeholder='프로젝트 설명을 입력하세요.' 
                        onChange={handleInputChange} 
                        value={formData.context} 
                    /> 
                    <div> 
                        <button type="submit">프로젝트 생성</button> 
                        <button type="button" onClick={modalCloseHandler}>취소</button> 
                    </div> 
                </form> 
            </ReactModal>  

            <div className="aside"> 
                <div className="aside-top"> 
                    <div>collawork</div> 
                    <button onClick={() => setNewShow(true)}>+ 새 프로젝트</button> 
                </div> 
                <div className="aside-bottom"> 
                    <div className="project-list"> 
                        <div className="project-item">프로젝트1</div> 
                        <div className="project-item">프로젝트2</div> 
                        <div className="project-item">프로젝트3</div> 
                        <div className="project-item">프로젝트4</div> 
                    </div> 
                </div> 
            </div> 
        </>  
    ); 
};

export default Aside;
