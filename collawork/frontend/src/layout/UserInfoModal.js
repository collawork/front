import React, { useEffect, useRef } from 'react';
import defaultImage from '../components/assest/images/default-profile.png';
import '../components/assest/css/UserInfoModal.css';

const UserInfoModal = ({ user, onClose }) => {
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target)
            ) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="user-info-modal">
            <div className="modal-content-info" ref={modalRef}>
                <img
                    src={user?.profileImageUrl || defaultImage}
                    alt={`${user?.username || '사용자'}의 프로필 이미지`}
                    className="profile-image-small"
                />
                <p>이름: {user?.username || '정보 없음'}</p>
                <p>이메일: {user?.email || '정보 없음'}</p>
                <p>회사명: {user?.company || '정보 없음'}</p>
                <p>직급: {user?.position || '정보 없음'}</p>
                <p>핸드폰 번호: {user?.phone || '정보 없음'}</p>
                <p>fax: {user?.fax || '정보 없음'}</p>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default UserInfoModal;
