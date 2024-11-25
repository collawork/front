import React from "react";
import "../components/assest/css/Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages < 1) return null; // 총 페이지가 1 미만일 경우 아무 것도 렌더링하지 않음

    const maxVisiblePages = 7; // 한 번에 표시할 최대 페이지 개수
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
        startPage = 1;
        endPage = totalPages;
    } else {
        const half = Math.floor(maxVisiblePages / 2);
        if (currentPage <= half) {
            startPage = 1;
            endPage = maxVisiblePages;
        } else if (currentPage + half >= totalPages) {
            startPage = totalPages - maxVisiblePages + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - half;
            endPage = currentPage + half;
        }
    }

    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <div className="pagination">
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                {"<<"}
            </button>
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                {"<"}
            </button>
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    className={currentPage === number ? "active" : ""}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                {">"}
            </button>
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                {">>"}
            </button>
        </div>
    );
};

export default Pagination;
