import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const ProjectList = ({ onProjectSelect }) => {
    const [projects, setProjects] = useState([]); // 프로젝트 데이터 (id, name 포함)
    const { userId } = useUser();
    const navigate = useNavigate();

    console.log("ProjectList userId:", userId);

    useEffect(() => {
        console.log("ProjectList useEffect 호출됨");
        fetchProjects();
    }, []);

    const fetchProjects = () => {
        const token = localStorage.getItem('token');
        const userIdValue = typeof userId === 'object' && userId !== null ? userId.userId : userId;

        axios.post(
            `/api/user/projects/selectAll`,
            { userId: userIdValue }, // JSON 형식
            {
                baseURL: API_URL,
                
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        )
        .then((response) => {
            console.log("프로젝트 목록 응답:", response.data);

            // 응답 데이터가 배열인지 확인용도
            if (Array.isArray(response.data)) {
                setProjects(response.data); // 데이터 설정
            } else {
                console.warn("API 응답이 배열이 아닙니다:", response.data);
                setProjects([]); // 배열이 아니면 빈 배열로 초기화
            }
        })
        .catch((error) => {
            console.error('프로젝트 목록을 불러오는 중 오류 발생:', error);
            setProjects([]); // 오류 발생 시 빈 배열로 초기화
        });
    };

    const handleMoreClick = () => {
        navigate('/project'); // '더보기' 클릭 시 프로젝트 페이지로 이동
    };

    return (
        <div className="project-list">
            <h3>프로젝트 목록</h3>
            <button onClick={handleMoreClick} className="more-button">
                + 더보기
            </button>
            <ul>
                {Array.isArray(projects) && projects.length > 0 ? (
                    projects.map((project) => (
                        <li key={project.id}>
                            <button
                                onClick={() => {
                                    console.log("선택된 프로젝트:", project);
                                    onProjectSelect(project); // 선택한 프로젝트 상위로 전달해야댐
                                }}
                            >
                                {project.name} {/* 프로젝트 이름임 */}
                            </button>
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
