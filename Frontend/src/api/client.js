import axios from 'axios';

/**
 * Custom Axios instance for the chatbot application.
 * Using a centralized instance allows for easy configuration of:
 * - Base URL
 * - Auth headers (via interceptors)
 * - Timeout settings
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://karmanai.onrender.com/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, 
});

// Interceptor for handling auth tokens if needed in the future
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

export default api;
