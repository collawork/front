import React, { useState } from 'react';
import UserInfoModal from '../layout/UserInfoModal';
import UserEditModal from '../layout/UserEditModal';
import { useNavigate } from 'react-router-dom';

const MyProfileIcon = ({ profileImage, user }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleViewProfile = () => {
        setIsInfoModalOpen(true);
        setIsDropdownOpen(false);
    };

    const handleEditProfile = () => {
        setIsEditModalOpen(true);
        setIsDropdownOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="profile-icon-container">
            <img
                src={profileImage || '../components/assest/images/default-profile.png'}
                alt="프로필"
                className="profile-icon"
                onClick={toggleDropdown}
            />
            {isDropdownOpen && (
                <div className="dropdown-menu">
                    <button onClick={handleViewProfile}>내 정보 보기</button>
                    <button onClick={handleEditProfile}>정보 변경</button>
                    <button onClick={handleLogout}>로그아웃</button>
                </div>
            )}
            {isInfoModalOpen && <UserInfoModal user={user} onClose={() => setIsInfoModalOpen(false)} />}
            {isEditModalOpen && <UserEditModal user={user} onClose={() => setIsEditModalOpen(false)} />}
        </div>
    );
};

export default MyProfileIcon;
