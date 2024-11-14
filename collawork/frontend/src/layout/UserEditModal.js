import React, { useState } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';

const UserEditModal = ({ user, onClose }) => {
    const [editData, setEditData] = useState({
        username: user.username || '',
        company: user.company || '',
        position: user.position || '',
        fax: user.fax || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await axios.put('http://localhost:8080/api/user/update', editData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('프로필이 성공적으로 업데이트되었습니다.');
            onClose();
        } catch (error) {
            console.error('프로필 업데이트 중 오류 발생:', error);
            alert('프로필 업데이트에 실패했습니다.');
        }
    };

    return (
        <ReactModal isOpen={true} onRequestClose={onClose} contentLabel="프로필 수정">
            <h2>프로필 수정</h2>
            <form onSubmit={handleSubmit}>
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
                <button onClick={onClose}>취소</button>
            </form>
        </ReactModal>
    );
};

export default UserEditModal;
