import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const API_URL = process.env.REACT_APP_API_URL;

const ProjectList = () => {
    const [projectName, setProjectName] = useState([]);
    const { userId } = useUser();
    console.log("project list : " + userId);

    useEffect(() => {
        selectProjectName();
    }, []);

    function selectProjectName() {
        const token = localStorage.getItem('token');
        const userIdValue = typeof userId === 'object' && userId !== null ? userId.userId : userId;
    
        console.log("플젝리스트 userId:", userId);
        console.log("플젝리스트 userIdValue:", userIdValue);
        console.log("Authorization Token:", token);
        console.log("프로젝트 이름 : " + projectName)
    
        axios({
            url: `/api/user/projects/selectAll`,
            method: 'post',
            baseURL: API_URL,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: { userId: userIdValue, projectName: projectName}, 
            withCredentials: true,
        })
        .then((response) => {
            setProjectName(response.data);
            console.log("프로젝트 목록 ::", response.data); 
        })
        .catch((error) => {
            console.error('프로젝트 목록을 불러오는 중 오류 발생:', error);
        });
    }
    
    
    return (
        <div className="project-list">
            <h3>프로젝트 목록</h3>
            <ul>
                {projectName.map((project, index) => (
                    <li key={index}>
                        <span>{project}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectList;
