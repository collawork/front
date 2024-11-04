import { Outlet } from "react-router-dom";
import TopHeader from "../components/TopHeader";
import Aside from "../components/Aside";
import "../components/assest/css/Layout.css"; 

const Layout = () => {
  return (
    <div className="layout-container">
      <div className="top-header">
        <div>collawork</div>
        <div>프로젝트 명</div>
      </div>

      <div className="main-content">
        <Aside />
        <div className="outlet-content">
          <Outlet />
        </div>
        
        <div className="participants">
          <div>참여자 목록 / 친구 목록</div>
          <div className="friend-list-modal">
            <ul>
              <li>a</li>
              <li>b</li>
              <li>c</li>
              <li>d</li>
              <li>e</li>
            </ul>
          </div>
          <div>Pagination or other content here</div>
        </div>
      </div>

    
    </div>
  );
};

export default Layout;
