import { userConfig } from '@/config/user-config';

const STORAGE_KEY = 'user_auth';

const clearAuthStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
};

export const authState = {
    currentUser: (() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
        } catch (error) {
            console.error('Error parsing stored user:', error);
            clearAuthStorage();
            return null;
        }
    })(),
};

export const login = (email, password) => {
    if (!email || !password) {
        console.warn('Login attempted with missing credentials');
        return null;
    }

    try {
        const user = userConfig.users.find(
            user => user.email === email && user.password === password
        );

        if (user) {
            const userInfo = {
                id: user.id, 
                name: user.username,
                email: user.email,
                role: user.role,
                lastLogin: new Date().toISOString(),
            };
            
            authState.currentUser = userInfo;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('userName', user.username);
            return userInfo; 
        }

        return null;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
};

export const logout = () => {
    try {
        authState.currentUser = null;
        clearAuthStorage();
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};

export const isAuthenticated = () => {
    return authState.currentUser !== null;
};

export const hasRole = (requiredRole) => {
    return authState.currentUser?.role === requiredRole;
};