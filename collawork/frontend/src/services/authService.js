import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// 회원가입 요청 함수
const registerUser = async (data) => {
    return await axios.post(`${API_URL}/api/auth/register`, data);
};

// 로그인 요청 함수
const login = async (data) => {
    return await axios.post(`${API_URL}/api/auth/login`, data);
};

// 중복 확인 요청 함수 (이름, 이메일, 전화번호 중복 확인)
const checkDuplicates = async (username, email, phone) => {
    return await axios.post(`${API_URL}/api/auth/check-duplicates`, {
        username,
        email,
        phone,
    });
};

export default {
    registerUser,
    checkDuplicates,
    login
};
