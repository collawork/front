import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Project from '../pages/Project';
import NewProject from './project/NewProject';

const Aside = () => {
  const [newProjectShow, setNewProjectShow] = useState(false);
  const navi = useNavigate();

  // 새 프로젝트 버튼 클릭 시 동작하는 핸들러 함수
  const onClickHandler = () => {
    setNewProjectShow(true);
    // 필요한 경우 특정 페이지로 이동하는 경우에는 navi 사용
    navi("/project", { state: { setNewProjectShow: setNewProjectShow, newProjectShow: newProjectShow } });
  };

  return (
    <div className="aside">
      <div className="aside-top">
        <div>collawork</div>
        {/* onClick에 함수 핸들러 전달 */}
        <button onClick={onClickHandler}>+ 새 프로젝트</button>
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
