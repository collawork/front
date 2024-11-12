import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// 회원가입 요청 함수
const registerUser = async (data) => {
    const formData = new FormData();

    const signupRequest = {
        username: data.username,
        email: `${data.email}@${data.emailDomain}`,
        password: data.password,
        company: data.company,
        position: data.position,
        phone: data.phone,
        fax: data.fax
    };

    formData.append("signupRequest", new Blob([JSON.stringify(signupRequest)], {
        type: 'application/json'
    }));

    if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
    }

    try {
        return await axios.post(`${API_URL}/api/auth/register`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });
    } catch (error) {
        console.error("회원가입 에러:", error);
        throw error;
    }
};

// 로그인 요청 함수
const login = async (data) => {
    try {
        const loginData = {
            email: data.email,
            password: data.password
        };

        const response = await axios.post(`${API_URL}/api/auth/login`, loginData, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        // 로그인 성공 시 응답에서 토큰과 사용자 ID를 로컬 스토리지에 저장
        if (response.data && response.data.token && response.data.userId && response.data.refreshToken) {
            localStorage.setItem('token', response.data.token); // 액세스 토큰
            localStorage.setItem('refreshToken', response.data.refreshToken); // 리프레시 토큰
            localStorage.setItem('userId', response.data.userId); // 사용자 ID 저장
            return { token: response.data.token, userId: response.data.userId };
        } else {
            throw new Error('로그인 응답에 필요한 정보가 포함되지 않았습니다.');
        }
    } catch (error) {
        console.error("로그인 에러: ", error);
        throw error;
    }
};

// 중복 확인 요청 함수
const checkDuplicates = async (username, email, phone) => {
    const token = localStorage.getItem('token');
    try {
        return await axios.post(`${API_URL}/api/auth/check-duplicates`, {
            username,
            email,
            phone,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error("중복 확인 에러: ", error);
        throw error;
    }
};

const authService = {
    registerUser,
    checkDuplicates,
    login
};

export default authService;
