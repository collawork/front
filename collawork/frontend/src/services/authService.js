import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

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

    return await axios.post(`${API_URL}/api/auth/register`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
    });
};

const login = async (data) => {
    try {
        // 로그인 데이터 형식 명시적 지정
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

        // 토큰이 응답으로 온 경우에만 로컬 스토리지에 저장
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            return response.data.token;
        } else {
            throw new Error('토큰이 포함된 응답을 받지 못했습니다.');
        }
    } catch (error) {
        console.error("로그인 에러: ", error);
        throw error;
    }
};



// 중복 확인 요청 함수
const checkDuplicates = async (username, email, phone) => {
    const token = localStorage.getItem('token');
    return await axios.post(`${API_URL}/api/auth/check-duplicates`, {
        username,
        email,
        phone,
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

const authService = {
    registerUser,
    checkDuplicates,
    login
};

export default authService;
