import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { projectStore } from '../../store';
import Pagination from '../Pagination'; // 기존에 구현한 Pagination 컴포넌트 사용
import '../../components/assest/css/ProjectList.css'


const ProjectList = ({ onProjectSelect }) => {

    const API_URL = process.env.REACT_APP_API_URL;

    const addTitle = projectStore(state => state.PlusProjectName);
    const [projects, setProjects] = useState([]); // 전체 프로젝트 데이터
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [pageSize] = useState(5); // 한 페이지당 표시할 프로젝트 수
    const { userId } = useUser();
    const navigate = useNavigate();

    // console.log("ProjectList userId:", userId);
    // console.log("localStorage.getItem : ", localStorage.getItem("userId"));

    useEffect(() => {
        console.log("ProjectList useEffect 호출됨");
        fetchProjects();
    }, []);

    const fetchProjects = () => {
        const token = localStorage.getItem('token'); // 토큰 가져오기
        if (!token) {
            console.error("토큰이 없습니다. API 호출을 중단합니다.");
            return;
        }
    
        // userId 처리
        const userIdValue = typeof userId === 'object' && userId !== null 
            ? userId.id || userId.userId  // 객체인 경우 id 또는 userId 속성 추출
            : userId;
    
        // userId 검증
        if (!userIdValue || isNaN(Number(userIdValue))) {
            console.error("유효하지 않은 userId:", userIdValue);
            return;
        }
    
        // API 호출
        axios.post(
            `/api/user/projects/selectAll`,
            { userId: Number(userIdValue) }, // 숫자로 변환 후 전달
            {
                baseURL: API_URL,
                headers: {
                    Authorization: `Bearer ${token}`,
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
                setProjects([]); // 초기화
            }
        })
        .catch((error) => {
            if (error.response) {
                // 서버 응답이 있는 경우
                console.error('서버 오류 발생:', error.response.data);
            } else if (error.request) {
                // 요청은 보내졌으나 응답이 없는 경우
                console.error('응답이 없습니다. 네트워크 문제:', error.request);
            } else {
                // 기타 에러
                console.error('API 호출 중 오류 발생:', error.message);
            }
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
            {/* 헤더 */}
            <div className="project-list-header">
                <span>내 프로젝트</span>
                <button onClick={handleMoreClick} className="more-button">
                    더보기
                </button>
            </div>
    
            {/* 프로젝트 리스트 */}
            <ul>
                {paginatedProjects.length > 0 ? (
                    paginatedProjects.map((project) => (
                        <li key={project.id}>
                            <button
                                onClick={() => {
                                    console.log("선택된 프로젝트:", project);
                                    addTitle(project.name);
                                    // onProjectSelect(project); // 선택한 프로젝트 상위로 전달
                                    navigate('/project', {projectId:project.id})
                                }}
                            >
                                {project.name}
                            </button>
                        </li>
                    ))
                ) : (
                    <li>프로젝트가 없습니다.</li>
                )}
            </ul>
    
            {/* 페이징 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
    
};

export default ProjectList;
