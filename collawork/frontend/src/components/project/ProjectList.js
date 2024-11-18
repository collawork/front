import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const ProjectList = () => {
    const [projectName, setProjectName] = useState([]);
    const { userId } = useUser();
    const navigate = useNavigate();
    console.log("project list : " + userId);

    useEffect(() => {
        console.log("ProjectList useEffect 호출됨");
        selectProjectName();
    }, []);
    

    const selectProjectName = () => {
        const token = localStorage.getItem('token');
        const userIdValue = typeof userId === 'object' && userId !== null ? userId.userId : userId;
    
        axios({
            url: `/api/user/projects/selectAll`,
            method: 'post',
            baseURL: API_URL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: { userId: userIdValue },
        })
            .then((response) => {
                // 응답이 배열인지 확인
                if (Array.isArray(response.data)) {
                    setProjectName(response.data);
                } else {
                    console.warn("API 응답이 배열이 아닙니다:", response.data);
                    setProjectName([]); // 배열이 아니면 빈 배열로 초기화
                }
            })
            .catch((error) => {
                console.error('프로젝트 목록을 불러오는 중 오류 발생:', error);
                setProjectName([]); // 오류 발생 시 빈 배열로 초기화
            });
    };
    
    

    const handleMoreClick = () => {
        navigate('/project');
    };
    
    return (
        <div className="project-list">
            <h3>프로젝트 목록</h3>
            <button onClick={handleMoreClick} className="more-button">
                + 더보기
            </button>
            <ul>
                {Array.isArray(projectName) && projectName.length > 0 ? (
                    projectName.map((project, index) => (
                        <li key={index}>
                            <span>{project}</span>
                        </li>
                    ))
                ) : (
                    <li>프로젝트가 없습니다.</li>
                )}
            </ul>
        </div>
    );
};

export default ProjectList;
