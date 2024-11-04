import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Project from '../pages/Project';
import NewProject from './project/NewProject';

const Aside = () => {

    const [newProjectShow, setNewProjectShow] = useState(false);
    const navi = useNavigate();

    const onClickHandler = () => {
      setNewProjectShow(true);
      // navi("/project", {setNewProjectShow: `${setNewProjectShow}`, newProjectShow:`${newProjectShow}`});
      
    };

     {/*  조회한 프로젝트 보여줘야함 */}
    return (
        <div className="aside">
            <div className="aside-top">
                <div>collawork</div>
                <button onClick={onClickHandler}>+ 새 프로젝트</button>
                {newProjectShow && <NewProject setNewProjectShow={setNewProjectShow}/>}
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
    );
};

export default Aside;
