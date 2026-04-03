import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    withCredentials: true, // send httpOnly cookie with every request
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Read the CSRF token from the cookie jar and attach it as a request header
// so the server can validate the double-submit cookie pattern.
function getCsrfToken() {
    const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Handle the response
        return response;
    },
    (error) => {
        // Handle the error
        if (error.response && error.response.status === 401) {
            // If the token is expired or invalid, redirect to login
            window.location.href = '/';
        }
        else if (error.response && error.response.status === 500) {
            console.error('Server error:Please Try Again', error.response.data);
        }
        else if (error.code === 'ECONNABORTED') {
            console.error('Request timed out. Please try again later.');
        }   
        return Promise.reject(error);
    }
);


export default axiosInstance;