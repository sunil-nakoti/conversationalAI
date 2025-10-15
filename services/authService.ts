// services/authService.ts
import { User } from '../types';

const API_URL = 'http://localhost:5000/api';

interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
    msg?: string;
}

interface ProfileResponse {
    success: boolean;
    user: User;
    msg?: string;
}

const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.msg || 'An error occurred');
    }
    return data;
};

export const login = async (credentials: { email, password }): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    const data = await handleResponse(response);
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    return data;
};

export const register = async (userData: { name, email, password }): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    const data = await handleResponse(response);
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    return data;
};

export const logout = (): void => {
    localStorage.removeItem('token');
};

export const getProfile = async (): Promise<User> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/users/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    const data: ProfileResponse = await handleResponse(response);
    return data.user;
};
