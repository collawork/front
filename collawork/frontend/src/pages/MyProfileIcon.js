import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UserInfoModal from '../layout/UserInfoModal';
import UserEditModal from '../layout/UserEditModal';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../components/assest/images/default-profile.png';
import '../components/assest/css/MyProfileIcon.css';

const MyProfileIcon = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const dropdownRef = useRef();

    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/user/info', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error('사용자 정보를 불러오는 중 에러 발생:', error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="profile-icon-container" ref={dropdownRef}>
            <img
                src={user?.profileImageUrl || defaultImage}
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
