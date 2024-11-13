import React, { useState } from 'react';
import axios from 'axios';

const UserEditModal = ({ user, onClose }) => {
    const [formData, setFormData] = useState({
        username: user.username,
        company: user.company,
        position: user.position,
        fax: user.fax
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/user/update`, formData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            alert('정보가 성공적으로 업데이트되었습니다.');
            onClose();
        } catch (error) {
            console.error('정보 업데이트 중 오류 발생:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>정보 변경</h2>
                <form onSubmit={handleSubmit}>
                    <label>이름:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />
                    <label>회사:</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} />
                    <label>직급:</label>
                    <input type="text" name="position" value={formData.position} onChange={handleChange} />
                    <label>팩스 번호:</label>
                    <input type="text" name="fax" value={formData.fax} onChange={handleChange} />
                    <button type="submit">저장</button>
                    <button onClick={onClose}>취소</button>
                </form>
            </div>
        </div>
    );
};

export default UserEditModal;
