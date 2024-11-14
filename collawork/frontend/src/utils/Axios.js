import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
});

instance.interceptors.request.use((config) => {
  console.log("request headers:", config.headers);
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        return Promise.reject(error);
      }

      try {
        const response = await axios.post('http://localhost:8080/api/auth/refresh', {}, {
          headers: { 'Authorization': `Bearer ${refreshToken}` }
        });
        const newAccessToken = response.data.token;
        
        console.log("새롭게 받은 인증 토근 :", newAccessToken);
        localStorage.setItem('token', newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      } catch (refreshError) {
        console.error("리프레시 토큰 갱신 실패:", refreshError);
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;

