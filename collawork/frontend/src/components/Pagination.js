import React from "react";
import "../components/assest/css/Pagination.css";
import leftArrow from '../components/assest/images/left-arrow.png';
import rightArrow from '../components/assest/images/right-arrow.png';
import leftDoubleArrow from '../components/assest/images/left-double-arrow.png';
import rightDoubleArrow from '../components/assest/images/right-double-arrow.png';

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
            {/* 처음으로 이동 */}
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="arrow-button"
            >
                <img src={leftDoubleArrow} alt="First Page" />
            </button>

            {/* 이전 페이지 */}
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="arrow-button"
            >
                <img src={leftArrow} alt="Previous Page" />
            </button>

            {/* 페이지 번호 */}
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    className={currentPage === number ? "active" : ""}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </button>
            ))}

            {/* 다음 페이지 */}
            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="arrow-button"
            >
                <img src={rightArrow} alt="Next Page" />
            </button>

            {/* 마지막 페이지 */}
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="arrow-button"
            >
                <img src={rightDoubleArrow} alt="Last Page" />
            </button>
        </div>
    );
};

export default Pagination;
