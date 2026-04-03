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