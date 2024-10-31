import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../components/assest/css/Register.css';
import defaultProfileImage from '../components/assest/images/default-profile.png';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '', email: '', emailDomain: '', password: '',
        company: '', position: '', phone: '', fax: '', profileImage: null
    });
    const [errors, setErrors] = useState({});
    const [validations, setValidations] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [domains] = useState(['naver.com','gmail.com', 'daum.com', "yahoo.com" ]);

    const validateUsername = useCallback(async () => {
        if (!formData.username) {
            setErrors(prev => ({ ...prev, username: '이름을 입력해주세요' }));
            setValidations(prev => ({ ...prev, username: false }));
        } else {
            try {
                await authService.checkDuplicates(formData.username, null, null);
                setErrors(prev => ({ ...prev, username: '' }));
                setValidations(prev => ({ ...prev, username: true }));
            } catch (error) {
                setErrors(prev => ({ ...prev, username: '아이디가 중복되었습니다.' }));
                setValidations(prev => ({ ...prev, username: false }));
            }
        }
    }, [formData.username]);

    const validateEmail = useCallback(async () => {
        if (!formData.email || !formData.emailDomain) {
            setErrors(prev => ({ ...prev, email: '이메일을 입력해주세요' }));
            setValidations(prev => ({ ...prev, email: false }));
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(`${formData.email}@${formData.emailDomain}`)) {
            setErrors(prev => ({ ...prev, email: '유효한 이메일 형식이 아닙니다' }));
            setValidations(prev => ({ ...prev, email: false }));
        } else {
            try {
                await authService.checkDuplicates(null, `${formData.email}@${formData.emailDomain}`, null);
                setErrors(prev => ({ ...prev, email: '' }));
                setValidations(prev => ({ ...prev, email: true }));
            } catch (error) {
                setErrors(prev => ({ ...prev, email: '이메일이 이미 존재합니다' }));
                setValidations(prev => ({ ...prev, email: false }));
            }
        }
    }, [formData.email, formData.emailDomain]);

    const validatePhone = useCallback(async () => {
        if (!formData.phone) {
            setErrors(prev => ({ ...prev, phone: '핸드폰 번호를 입력해주세요' }));
            setValidations(prev => ({ ...prev, phone: false }));
        } else if (formData.phone.length !== 11) {
            setErrors(prev => ({ ...prev, phone: '핸드폰 번호는 11자리여야 합니다.' }));
            setValidations(prev => ({ ...prev, phone: false }));
        } else {
            try {
                await authService.checkDuplicates(null, null, formData.phone);
                setErrors(prev => ({ ...prev, phone: '' }));
                setValidations(prev => ({ ...prev, phone: true }));
            } catch (error) {
                setErrors(prev => ({ ...prev, phone: '핸드폰 번호가 이미 존재합니다' }));
                setValidations(prev => ({ ...prev, phone: false }));
            }
        }
    }, [formData.phone]);

    useEffect(() => {
        if (formData.username) validateUsername();
        if (formData.email && formData.emailDomain) validateEmail();
        if (formData.phone) validatePhone();
    }, [formData.username, formData.email, formData.emailDomain, formData.phone, validateUsername, validateEmail, validatePhone]);
    

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profileImage' && files.length > 0) {
            setFormData({ ...formData, profileImage: files[0] });
            setPreviewImage(URL.createObjectURL(files[0]));
        } else if (name === 'emailDomain') {
            setFormData({ ...formData, emailDomain: value });
        } else if (name === 'phone') {
            const formattedValue = value.replace(/\D/g, '');
            setFormData({ ...formData, [name]: formattedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validations.username || !validations.email || !validations.phone) {
            alert('입력 정보를 확인해주세요.');
            return;
        }

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
        <div className="register-container">
            <h2>회원가입</h2>
            <div className="profile-image-container">
                <label htmlFor="profileImage">
                    <img src={previewImage || defaultProfileImage} alt="프로필 미리보기" className="profile-preview" />
                </label>
                <input type="file" id="profileImage" name="profileImage" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />
            </div>

            <form onSubmit={handleSubmit} className="register-form">
                <div className="input-group">
                    <label>이름</label>
                    <input type="text" name="username" placeholder="이름" onChange={handleChange} required />
                    {errors.username && <p className="error-text">{errors.username}</p>}
                </div>

                <div className="input-group email-group">
                    <label>이메일</label>
                    <input type="text" name="email" placeholder="이메일" onChange={handleChange} required />
                    <span>@</span>
                    <input type="text" name="emailDomain" placeholder="도메인" value={formData.emailDomain} onChange={handleChange} required />
                    <select onChange={(e) => setFormData({ ...formData, emailDomain: e.target.value })}>
                        <option value="">직접 입력</option>
                        {domains.map(domain => (
                            <option key={domain} value={domain}>{domain}</option>
                        ))}
                    </select>
                </div>
                {errors.email && <p className="error-text">{errors.email}</p>}

                <div className="input-group">
                    <label>비밀번호</label>
                    <input type="password" name="password" placeholder="비밀번호" onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>회사명</label>
                    <input type="text" name="company" placeholder="회사명" onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>직급</label>
                    <input type="text" name="position" placeholder="직급" onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>핸드폰 번호</label>
                    <input type="text" name="phone" placeholder="핸드폰 번호" onChange={handleChange} required maxLength="11" />
                    {errors.phone && <p className="error-text">{errors.phone}</p>}
                </div>
                <div className="input-group">
                    <label>팩스</label>
                    <input type="text" name="fax" placeholder="FAX" onChange={handleChange} />
                </div>
                <button type="submit" className="submit-button">가입하기</button>
            </form>
        </div>
    );
}

export default Register;
