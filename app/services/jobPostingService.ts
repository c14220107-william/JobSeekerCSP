const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Types
export interface Qualification {
    id: number;
    name: string;
}

export interface JobPosting {
    id: number;
    title: string;
    location: string;
    salary: string;
    description: string;
    tenure: string;
    type: string;
    status: 'open' | 'closed';
    qualifications: Qualification[];
    applications?: Array<{
        id: number;
        user: {
            id: number;
            name: string;
            email: string;
        };
        profile: {
            full_name: string;
            age?: number;
            avatar_url?: string;
            cv_url?: string;
        };
        status: 'pending' | 'accepted' | 'rejected';
        applied_at: string;
    }>;
    created_at: string;
    updated_at?: string;
    company?: {
        id: number;
        name: string;
        description?: string;
        photo_url?: string;
    };
}

export interface CreateJobPostingData {
    title: string;
    location: string;
    salary: string;
    description: string;
    tenure: string;
    type: string;
    status: 'open' | 'closed';
    qualification_ids: number[];
}

// Get token from localStorage
const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

// Get all qualifications (public)
export const getQualifications = async (): Promise<Qualification[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/qualifications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch qualifications');
        }

        return data.data.qualifications;
    } catch (error) {
        throw error;
    }
};

// Get company's job postings (authenticated)
export const getMyJobPostings = async (): Promise<JobPosting[]> => {
    const token = getToken();
    if (!token) throw new Error('No authentication token found');

    try {
        const response = await fetch(`${API_BASE_URL}/company/job-postings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch job postings');
        }

        return data.data.job_postings;
    } catch (error) {
        throw error;
    }
};

// Get single job posting by ID (authenticated - company owned)
export const getJobPostingById = async (id: string | number): Promise<JobPosting> => {
    const token = getToken();
    if (!token) {
        console.error('No token found in localStorage');
        throw new Error('No authentication token found. Please login again.');
    }

    console.log('Fetching job posting ID:', id);
    console.log('Using token:', token.substring(0, 20) + '...');

    try {
        const response = await fetch(`${API_BASE_URL}/company/job-postings/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        console.log('getJobPostingById response:', { status: response.status, data });

        if (!response.ok) {
            console.error('Error fetching job posting:', data);
            
            // More specific error messages
            if (response.status === 401) {
                throw new Error('Session expired. Please login again.');
            }
            if (response.status === 404) {
                throw new Error('Job posting not found. It may have been deleted or you do not have access to it.');
            }
            if (response.status === 403) {
                throw new Error('You do not have permission to view this job posting.');
            }
            
            throw new Error(data.message || `Failed to fetch job posting (Status: ${response.status})`);
        }

        if (!data.data || !data.data.job_posting) {
            console.error('Invalid response structure:', data);
            throw new Error('Invalid response from server');
        }

        return data.data.job_posting;
    } catch (error) {
        console.error('Exception in getJobPostingById:', error);
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Cannot connect to server. Please check your internet connection.');
        }
        throw error;
    }
};

// Create new job posting
export const createJobPosting = async (formData: CreateJobPostingData): Promise<JobPosting> => {
    const token = getToken();
    if (!token) throw new Error('No authentication token found');

    try {
        const response = await fetch(`${API_BASE_URL}/company/job-postings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle validation errors
            if (data.errors) {
                const firstError = Object.values(data.errors)[0];
                throw new Error(Array.isArray(firstError) ? firstError[0] : firstError as string);
            }
            throw new Error(data.message || 'Failed to create job posting');
        }

        return data.data.job_posting;
    } catch (error) {
        throw error;
    }
};

// Update job posting
export const updateJobPosting = async (id: string | number, formData: CreateJobPostingData): Promise<JobPosting> => {
    const token = getToken();
    if (!token) throw new Error('No authentication token found');

    try {
        const response = await fetch(`${API_BASE_URL}/company/job-postings/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle validation errors
            if (data.errors) {
                const firstError = Object.values(data.errors)[0];
                throw new Error(Array.isArray(firstError) ? firstError[0] : firstError as string);
            }
            throw new Error(data.message || 'Failed to update job posting');
        }

        return data.data.job_posting;
    } catch (error) {
        throw error;
    }
};

// Delete job posting
export const deleteJobPosting = async (id: string | number): Promise<void> => {
    const token = getToken();
    if (!token) throw new Error('No authentication token found');

    try {
        const response = await fetch(`${API_BASE_URL}/company/job-postings/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete job posting');
        }
    } catch (error) {
        throw error;
    }
};
