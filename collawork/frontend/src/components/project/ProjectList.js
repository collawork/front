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

    function selectProjectName(){
        axios({
            url: `${API_URL}/api/user/projects/selectAll`,
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            method: 'post',
            params: { userId },
            baseURL: 'http://localhost:8080',
            withCredentials: true,
        }).then((response) => {
            setProjectName(response.data);
            console.log("projectList 의 프젝목록 :: " + response.data);
        });
    };

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
