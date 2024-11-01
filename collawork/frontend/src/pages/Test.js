import { jwtDecode } from 'jwt-decode';

function UserProfile() {
    const token = localStorage.getItem('token');
    
    if (token) {
        try {
            const decoded = jwtDecode(token);
            console.log("디코딩된 사용자 정보:", decoded);
        } catch (error) {
            console.error("유효하지 않은 토큰:", error);
        }
    } else {
        console.log("토큰이 없습니다.");
    }

    return (
        <div>
            사용자 프로필 정보
        </div>
    );
}

export default UserProfile;
