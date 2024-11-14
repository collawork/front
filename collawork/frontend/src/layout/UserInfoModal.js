import React from 'react';
import ReactModal from 'react-modal';

const UserInfoModal = ({ user, onClose }) => {
    return (
        <ReactModal isOpen={true} onRequestClose={onClose} contentLabel="내 정보 보기">
            <h2>내 정보</h2>
            <p>이름: {user.username || '정보 없음'}</p>
            <p>이메일: {user.email || '정보 없음'}</p>
            <p>회사명: {user.company || '정보 없음'}</p>
            <p>직급: {user.position || '정보 없음'}</p>
            <p>전화번호: {user.phone || '정보 없음'}</p>
            <p>팩스: {user.fax || '정보 없음'}</p>
            <button onClick={onClose}>닫기</button>
        </ReactModal>
    );
};

export default UserInfoModal;
