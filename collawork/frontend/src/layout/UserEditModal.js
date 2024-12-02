import React, { useState, useRef } from 'react';
import axios from 'axios';
import ReactModal from 'react-modal';
import defaultImage from '../components/assest/images/default-profile.png';
import '../components/assest/css/UserEditModal.css';

const UserEditModal = ({ user, onClose, onUpdate }) => {
    const [editData, setEditData] = useState({
        username: user.username || '',
        company: user.company || '',
        position: user.position || '',
        fax: user.fax || '',
        profileImage: user.profileImageUrl || defaultImage,
    });
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageClick = () => {
        // 파일 입력 필드 클릭
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setEditData((prevData) => ({
                    ...prevData,
                    profileImage: reader.result, // 이미지 미리보기
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();

        // 필드 추가
        Object.entries(editData).forEach(([key, value]) => {
            if (key !== 'profileImage' || typeof value !== 'string') {
                formData.append(key, value);
            }
        });

        // 프로필 이미지 파일 추가
        const fileInput = fileInputRef.current.files[0];
        if (fileInput) {
            formData.append('profileImage', fileInput);
        }

        try {
            const response = await axios.put('http://localhost:8080/api/user/update', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('프로필이 성공적으로 업데이트되었습니다.');
            onUpdate(editData); // 변경된 정보 전달
            onClose();
        } catch (error) {
            console.error('프로필 업데이트 중 오류 발생:', error);
            alert('프로필 업데이트에 실패했습니다.');
        }
    };

    return (
        <ReactModal
            isOpen={true}
            onRequestClose={onClose}
            contentLabel="프로필 수정"
            className="ReactModal__Content-userEdit"
            overlayClassName="ReactModal__Overlay"
        >
            <h2>프로필 수정</h2>
            <form onSubmit={handleSubmit}>
                <div className="image-upload-container">
                    <img
                        src={editData.profileImage}
                        alt="프로필 이미지"
                        className="profile-image-preview"
                        onClick={handleImageClick}
                        title="클릭하여 이미지 변경"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                </div>
                <label>이름</label>
                <input
                    type="text"
                    name="username"
                    value={editData.username}
                    onChange={handleChange}
                />
                <label>회사명</label>
                <input
                    type="text"
                    name="company"
                    value={editData.company}
                    onChange={handleChange}
                />
                <label>직급</label>
                <input
                    type="text"
                    name="position"
                    value={editData.position}
                    onChange={handleChange}
                />
                <label>팩스 번호</label>
                <input
                    type="text"
                    name="fax"
                    value={editData.fax}
                    onChange={handleChange}
                />
                <button type="submit">저장</button>
                <button type="button" onClick={onClose}>
                    취소
                </button>
            </form>
        </ReactModal>
    );
};

export default UserEditModal;
