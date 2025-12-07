const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Types
interface UserData {
    full_name: string;
    email: string;
    role?: string;
    token?: string;
    user_id?: number;
    [key: string]: unknown;
}

// Login API
export const loginUser = async (email: string, password: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle validation errors
            if (data.errors) {
                const firstError = Object.values(data.errors)[0];
                throw new Error(Array.isArray(firstError) ? firstError[0] : firstError as string);
            }
            throw new Error(data.message || 'Login failed');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Register API
export const registerUser = async (full_name: string, email: string, password: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ full_name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle validation errors
            if (data.errors) {
                const firstError = Object.values(data.errors)[0];
                throw new Error(Array.isArray(firstError) ? firstError[0] : firstError as string);
            }
            throw new Error(data.message || 'Registration failed');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Register Company API
export const registerCompany = async (
    company_name: string,
    email: string,
    password: string,
) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register/company`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_name,
                email,
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle validation errors
            if (data.errors) {
                const firstError = Object.values(data.errors)[0];
                throw new Error(Array.isArray(firstError) ? firstError[0] : firstError as string);
            }
            throw new Error(data.message || 'Registration failed');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Save user data to localStorage
export const saveUserData = (userData: UserData) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.token) {
            localStorage.setItem('token', userData.token);
        }
    }
};

// Get user data from localStorage
export const getUserData = (): UserData | null => {
    if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }
    return null;
};

// Get token from localStorage
export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

// Logout user
export const logoutUser = async () => {
    const token = getToken();

    if (token) {
        try {
            await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Logout API error:', error);
        }
    }

    // Clear localStorage regardless of API success
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
};

// Check if user is logged in
export const isUserLoggedIn = () => {
    return getUserData() !== null;
};

// Update user profile
export const updateUserProfile = async (formData: FormData) => {
    const token = getToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.errors) {
                const firstError = Object.values(data.errors)[0];
                throw new Error(Array.isArray(firstError) ? firstError[0] : firstError as string);
            }
            throw new Error(data.message || 'Update profile failed');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Get user profile
export const getUserProfile = async () => {
    const token = getToken();
    
    try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch profile');
        }

        return data;
    } catch (error) {
        throw error;
    }
};
