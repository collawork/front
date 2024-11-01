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

        console.log("로그인 응답:", response.data);

        const token = response.data.token;
        if (token) {
            localStorage.setItem('token', token);
            return token;
        } else {
            console.error("토큰이 응답에 없습니다:", response.data);
            throw new Error("토큰이 응답에 없습니다.");
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
