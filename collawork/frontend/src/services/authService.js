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
        fax: data.fax,
    };

    formData.append(
        'signupRequest',
        new Blob([JSON.stringify(signupRequest)], {
            type: 'application/json',
        })
    );

    if (data.profileImage) {
        formData.append('profileImage', data.profileImage);
    }

    try {
        return await axios.post(`${API_URL}/api/auth/register`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });
    } catch (error) {
        console.error('회원가입 에러:', error);
        throw error;
    }
};

const checkDuplicates = async (username, email, phone) => {
    const requestData = { username, email, phone };

    try {
        // 중복 확인 요청은 비로그인 사용자도 할 수 있어야 함
        return await axios.post(`${API_URL}/api/auth/check-duplicates`, requestData, {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('중복 확인 에러: ', error);
        throw error;
    }
};

const login = async (data) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/auth/login`,
            {
                email: data.email,
                password: data.password,
            },
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            }
        );

        if (response.data?.token && response.data?.userId) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            return response.data;
        } else {
            throw new Error('로그인 실패');
        }
    } catch (error) {
        console.error('로그인 에러: ', error);
        throw error;
    }
};

const authService = {
    registerUser,
    checkDuplicates,
    login,
};

export default authService;
