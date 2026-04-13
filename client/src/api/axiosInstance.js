import axios from 'axios';

// API Gateway eka hari Auth service eke URL eka danna
const API = axios.create({
    baseURL: 'http://localhost:5000/api/auth', // Auth service eke base URL eka
});

// Request Interceptor
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Login weddi save karagaththa token eka
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Header ekata token eka add kirima
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;