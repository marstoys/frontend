import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_REQUEST } from "./useEnv";

// Extend the AxiosRequestConfig type to include our custom property
declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        _retry?: boolean;
    }
}

// Create axios instance
export const instance = axios.create({
    baseURL: API_REQUEST,
});

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig;
        
        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Try to get new access token
                const response = await axios.post(`${API_REQUEST}/users/token/refresh/`, {
                    refresh: refreshToken
                });

                const { access } = response.data;
                
                // Save new access token
                localStorage.setItem('access_token', access);
                
                // Update the authorization header
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                }
                
                // Retry the original request
                return instance(originalRequest);
            } catch (refreshError) {
                // If refresh token fails, clear tokens and redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);