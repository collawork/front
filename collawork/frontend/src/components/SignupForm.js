import React, { useState } from 'react';
import authService from '../services/authService';

function SignupForm() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.registerUser(formData);
            alert('회원가입이 완료되었습니다.');
        } catch (error) {
            console.error(error);
            alert('회원가입에 실패했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="이름" onChange={handleChange} />
            <input type="email" name="email" placeholder="이메일" onChange={handleChange} />
            <input type="password" name="password" placeholder="비밀번호" onChange={handleChange} />
            <button type="submit">회원가입</button>
        </form>
    );
}

export default SignupForm;
