const API_BASE_URL = 'http://172.22.84.57:8000/api';

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
            // Handle 403 for unapproved company
            if (response.status === 403 && data.data?.role === 'company' && !data.data?.is_approved) {
                throw new Error(data.message || 'Your company account is pending approval from admin. Please wait for approval.');
            }
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

// Get company profile
export const getCompanyProfile = async () => {
    const token = getToken();

    try {
        const response = await fetch(`${API_BASE_URL}/company/details`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Server returned non-JSON response (status ${response.status}): ${text.substring(0, 200)}`);
        }

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(data.message || 'Company details not found (404)');
            }
            if (response.status === 401) {
                throw new Error(data.message || 'Unauthorized (401). Please login again.');
            }
            if (response.status === 403) {
                throw new Error(data.message || 'Forbidden (403). Your company may not be approved or you do not have access.');
            }
            if (response.status === 405) {
                throw new Error(data.message || 'Method not allowed (405) when fetching company details');
            }
            throw new Error(data.message || 'Failed to fetch company details');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Update company profile
export const updateCompanyProfile = async (formData: FormData) => {
    const token = getToken();

    try {
        // Add _method for Laravel to handle PUT with FormData
        formData.append('_method', 'PUT');

        const response = await fetch(`${API_BASE_URL}/company/profile`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Server returned non-JSON response (status ${response.status}): ${text.substring(0, 200)}`);
        }

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error(data.message || 'Unauthorized (401). Please login again.');
            }
            if (response.status === 403) {
                throw new Error(data.message || 'Forbidden (403). Your company may not be approved or you do not have access.');
            }
            if (response.status === 405) {
                throw new Error(data.message || 'Method not allowed (405). Backend expects PUT /company/profile');
            }
            if (data.errors) {
                const firstError = Object.values(data.errors)[0];
                throw new Error(Array.isArray(firstError) ? firstError[0] : firstError as string);
            }
            throw new Error(data.message || 'Update company profile failed');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Apply to job posting (job seeker)
export const applyToJob = async (jobId: string) => {
    const token = getToken();

    try {
        // The apply endpoint is under the `user` prefix and requires auth: /api/user/job-postings/{id}/apply
        const response = await fetch(`${API_BASE_URL}/user/job-postings/${jobId}/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({}),
        });

        const data = await response.json();

        if (!response.ok) {
            // Helpful messages for common statuses
            if (response.status === 404) {
                throw new Error(data.message || 'Job not found (404)');
            }
            if (response.status === 400) {
                throw new Error(data.message || 'Bad request (400) - you may have already applied or the job is closed');
            }
            if (data.errors) {
                const firstError = Object.values(data.errors)[0];
                throw new Error(Array.isArray(firstError) ? firstError[0] : (firstError as string));
            }
            throw new Error(data.message || 'Failed to apply to job');
        }

        return data;
    } catch (error) {
        throw error;
    }
};
