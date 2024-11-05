import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 만료된 토큰으로 인해 403 Forbidden 에러가 발생한 경우
    if (error.response && error.response.status === 403) {
      console.error("JWT 토큰이 만료되었습니다. 다시 로그인하십시오.");
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      
      // 로그아웃 처리 또는 새로 로그인 유도
      window.location.href = "/login";
      
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default instance;
