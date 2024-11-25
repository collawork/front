import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Pagination from '../Pagination'; // 기존에 구현한 Pagination 컴포넌트 사용

const API_URL = process.env.REACT_APP_API_URL;

const ProjectList = ({ onProjectSelect }) => {
    const [projects, setProjects] = useState([]); // 전체 프로젝트 데이터
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [pageSize] = useState(5); // 한 페이지당 표시할 프로젝트 수
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
            { userId: userIdValue },
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
            if (Array.isArray(response.data)) {
                setProjects(response.data); // 전체 데이터 설정
            } else {
                console.warn("API 응답이 배열이 아닙니다:", response.data);
                setProjects([]);
            }
        })
        .catch((error) => {
            console.error('프로젝트 목록을 불러오는 중 오류 발생:', error);
            setProjects([]); // 오류 시 빈 배열로 초기화
        });
    };

    const handleMoreClick = () => {
        navigate('/project'); // '더보기' 클릭 시 프로젝트 페이지로 이동
    };

    // 현재 페이지에 표시할 프로젝트 계산
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProjects = projects.slice(startIndex, endIndex);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(projects.length / pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="project-list">
            <h3>프로젝트 목록</h3>
            <button onClick={handleMoreClick} className="more-button">
                + 더보기
            </button>
            <ul>
                {paginatedProjects.length > 0 ? (
                    paginatedProjects.map((project) => (
                        <li key={project.id}>
                            <button
                                onClick={() => {
                                    console.log("선택된 프로젝트:", project);
                                    onProjectSelect(project); // 선택한 프로젝트 상위로 전달
                                }}
                            >
                                {project.name} {/* 프로젝트 이름 */}
                            </button>
                        </li>
                    ))
                ) : (
                    <li>프로젝트가 없습니다.</li>
                )}
            </ul>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ProjectList;
