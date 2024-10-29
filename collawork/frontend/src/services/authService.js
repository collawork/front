import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const registerUser = async (data) => {
    return await axios.post(`${API_URL}/api/auth/register`, data);
};

export default {
    registerUser
};
