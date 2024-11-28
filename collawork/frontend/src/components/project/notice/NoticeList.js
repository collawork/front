import React, { useEffect, useState } from "react";
import axios from "axios";
import NoticeDetailModal from "./NoticeDetail";
import NoticeCreateModal from "./CreateNotice";
import { useUser } from "../../../context/UserContext";
import "../../../components/assest/css/NoticeList.css";
import Pagination from "../../Pagination";
import { projectStore } from "../../../store";

const NoticeList = () => {
    const [notices, setNotices] = useState([]);
    const [userRole, setUserRole] = useState("");
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { userId } = useUser();
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [pageSize] = useState(7); // 한 페이지당 항목 수
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const { projectData } = projectStore();

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchNotices();
        fetchUserRole();
    }, [projectData.id]);

    const fetchNotices = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("토큰이 없습니다.");
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/api/projects/${projectData.id}/notices`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const allNotices = response.data; // 전체 데이터 가져오기
            if (Array.isArray(allNotices)) {
                setNotices(allNotices); // 전체 데이터를 상태로 저장
                setTotalPages(Math.ceil(allNotices.length / pageSize)); // 총 페이지 수 계산
            } else {
                console.error("API 응답 형식이 올바르지 않습니다:", response.data);
            }
        } catch (error) {
            console.error("공지사항 목록 조회 실패:", error);
        }
    };

    const paginatedNotices = notices.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const fetchUserRole = async () => {
        if (!projectData.id) return;

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("토큰이 없습니다.");
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/api/user/projects/${projectData.id}/role`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { userId },
            });
            setUserRole(response.data.role);
        } catch (error) {
            console.error("사용자 역할을 가져오는 중 오류 발생:", error);
            setUserRole(null);
        }
    };

    const openDetailModal = (noticeId) => {
        setSelectedNotice(noticeId);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedNotice(null);
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleNoticeCreated = (newNotice) => {
        setNotices((prevNotices) => [newNotice, ...prevNotices]);
        closeCreateModal();
    };

    const handleNoticeUpdated = () => {
        fetchNotices();
        closeDetailModal();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="notice-list-container">
            <h1>공지사항</h1>
            {userRole === "ADMIN" && (
                <button className="create-notice-button" onClick={openCreateModal}>
                    공지사항 작성
                </button>
            )}
            <table className="notice-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>중요</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                        <th>조회수</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedNotices.map((notice, index) => (
                        <tr key={notice.id} onClick={() => openDetailModal(notice.id)}>
                            <td>{index + 1 + (currentPage - 1) * pageSize}</td>
                            <td>{notice.important ? "중요" : ""}</td>
                            <td>{notice.title}</td>
                            <td>{notice.creatorName || "알 수 없음"}</td>
                            <td>{new Date(notice.createdAt).toLocaleString()}</td>
                            <td>{notice.viewCount || 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            {isDetailModalOpen && selectedNotice && (
                <NoticeDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={closeDetailModal}
                    projectId={projectData.id}
                    noticeId={selectedNotice}
                    onNoticeUpdated={handleNoticeUpdated}
                />
            )}
            {isCreateModalOpen && (
                <NoticeCreateModal
                    isOpen={isCreateModalOpen}
                    onClose={closeCreateModal}
                    projectId={projectData.id}
                    onNoticeCreated={handleNoticeCreated}
                />
            )}
        </div>
    );
};

export default NoticeList;
