import React from 'react';

const UserInfoModal = ({ user, onClose }) => {
    const { username, email, company, position, phone, fax, created_at, profile_image } = user;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>내 정보 보기</h2>
                <p>{profile_image}</p>
                <p><strong>이름:</strong> {username}</p>
                <p><strong>이메일:</strong> {email}</p>
                <p><strong>회사:</strong> {company}</p>
                <p><strong>직급:</strong> {position}</p>
                <p><strong>핸드폰 번호:</strong> {phone}</p>
                <p><strong>팩스 번호:</strong> {fax}</p>
                <p><strong>가입일:</strong> {new Date(created_at).toLocaleDateString()}</p>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default UserInfoModal;
