import {jwtDecode} from "jwt-decode";

function UserProfile() {
    const token = localStorage.getItem('token');
    if (token && token.split('.').length === 3) { // JWT 형식 확인
        const decoded = jwtDecode(token);
        console.log("디코딩된 사용자 정보:", decoded);
    } else {
        console.error("유효하지 않은 토큰 형식:", token);
    }
}

export default UserProfile;
