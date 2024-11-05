// utils/Axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 403) {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        console.error("리프레시 토큰이 없습니다. 다시 로그인하십시오.");
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        // window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // 리프레시 토큰을 이용해 새로운 액세스 토큰 요청
        const response = await axios.post('http://localhost:8080/api/auth/refresh', { refreshToken });
        const newAccessToken = response.data.token;
        
        // 새로운 토큰 저장
        localStorage.setItem('token', newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // 갱신된 토큰으로 원래 요청 다시 시도
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("리프레시 토큰 갱신 실패:", refreshError);
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
