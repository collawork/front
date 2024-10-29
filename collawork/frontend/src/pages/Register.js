import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '', nickname: '', email: '', password: '',
        company: '', position: '', phone: '', fax: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.registerUser(formData);
            alert('회원가입이 완료되었습니다.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert('회원가입에 실패했습니다.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>회원가입 페이지</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="이름" onChange={handleChange} required />
                <input type="email" name="email" placeholder="이메일" onChange={handleChange} required />
                <input type="password" name="password" placeholder="비밀번호" onChange={handleChange} required />
                <input type="text" name="company" placeholder="회사명" onChange={handleChange} />
                <input type="text" name="position" placeholder="직급" onChange={handleChange} />
                <input type="text" name="phone" placeholder="핸드폰 번호" onChange={handleChange} />
                <input type="text" name="fax" placeholder="FAX" onChange={handleChange} />
                <button type="submit" style={styles.button}>회원가입 완료</button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '50px',
    },
    button: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '1rem',
        cursor: 'pointer',
    },
};

export default Register;
