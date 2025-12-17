const API_BASE_URL = 'http://172.22.83.182:8000/api';

// Get token from localStorage
const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

// TypeScript Interfaces
export interface Company {
    id: number;
    user_id: number;
    name: string;
    description: string;
    address: string;
    photo_url?: string;
    is_approved: boolean;
    created_at: string;
}

export interface CompanyUser {
    id: number;
    name: string;
    email: string;
    role: string;
    is_approved: boolean;
    company: Company;
    created_at: string;
}

// Get pending companies
export const getPendingCompanies = async (): Promise<CompanyUser[]> => {
    const token = getToken();
    if (!token) throw new Error('No authentication token found');

    try {
        const response = await fetch(`${API_BASE_URL}/admin/companies/pending`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch pending companies');
        }

        return data.data.companies;
    } catch (error) {
        console.error('Error fetching pending companies:', error);
        throw error;
    }
};

// Get approved companies
export const getApprovedCompanies = async (): Promise<CompanyUser[]> => {
    const token = getToken();
    if (!token) throw new Error('No authentication token found');

    try {
        const response = await fetch(`${API_BASE_URL}/admin/companies/approved`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch approved companies');
        }

        return data.data.companies;
    } catch (error) {
        console.error('Error fetching approved companies:', error);
        throw error;
    }
};

// Approve company
export const approveCompany = async (userId: number): Promise<CompanyUser> => {
    const token = getToken();
    if (!token) throw new Error('No authentication token found');

    try {
        const response = await fetch(`${API_BASE_URL}/admin/companies/${userId}/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to approve company');
        }

        return data.data.user;
    } catch (error) {
        console.error('Error approving company:', error);
        throw error;
    }
};

// Reject company
export const rejectCompany = async (userId: number): Promise<CompanyUser> => {
    const token = getToken();
    if (!token) throw new Error('No authentication token found');

    try {
        const response = await fetch(`${API_BASE_URL}/admin/companies/${userId}/reject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to reject company');
        }

        return data.data.user;
    } catch (error) {
        console.error('Error rejecting company:', error);
        throw error;
    }
};

// Job Postings Interface
export interface JobPosting {
    id: string;
    title: string;
    description: string;
    location: string;
    salary: string;
    type: string;
    tenure: string;
    status: 'open' | 'closed';
    company: {
        id: number;
        name: string;
        address: string;
        user: {
            name: string;
            email: string;
        };
    };
    qualifications: Array<{ id: number; name: string }>;
    applications_count?: number;
    created_at: string;
}

// Get all job postings
export const getAllJobPostings = async (): Promise<JobPosting[]> => {
    const token = getToken();
    if (!token) throw new Error('No authentication token found');

    try {
        const response = await fetch(`${API_BASE_URL}/admin/job-postings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch job postings');
        }

        return data.data.job_postings;
    } catch (error) {
        console.error('Error fetching job postings:', error);
        throw error;
    }
};

// Applications Interface
export interface Application {
    id: number;
    seeker: {
        id: number;
        user: {
            name: string;
            email: string;
        };
        phone?: string;
        cv_url?: string;
    };
    jobPosting: {
        id: string;
        title: string;
        company: {
            id: number;
            name: string;
        };
    };
    status: string;
    created_at: string;
}

// Get all applications
export const getAllApplications = async (): Promise<Application[]> => {
    const token = getToken();
    if (!token) throw new Error('No authentication token found');

    try {
        const response = await fetch(`${API_BASE_URL}/admin/applications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch applications');
        }

        return data.data.applications;
    } catch (error) {
        console.error('Error fetching applications:', error);
        throw error;
    }
};

// Dashboard Statistics Interface
export interface DashboardStats {
    total_users: number;
    total_companies: number;
    total_approved_companies: number;
    total_pending_companies: number;
    total_job_postings: number;
    total_active_job_postings: number;
    total_applications: number;
}

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
    const token = getToken();
    if (!token) throw new Error('No authentication token found');

    try {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch dashboard statistics');
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};
