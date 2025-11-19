// API utility functions for admin panel
// TODO: Update BASE_URL to match your backend API endpoint
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// Helper function to get auth token
// TODO: Replace with your actual auth token retrieval method
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Helper function to make authenticated requests
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/admin/dashboard`);
    const data: ApiResponse<unknown> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch dashboard stats');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Get pending companies
export const getPendingCompanies = async () => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/admin/companies/pending`);
    const data: ApiResponse<{ companies: unknown[] }> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch pending companies');
    }

    return data.data?.companies || [];
  } catch (error) {
    console.error('Error fetching pending companies:', error);
    throw error;
  }
};

// Get approved companies
export const getApprovedCompanies = async () => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/admin/companies/approved`);
    const data: ApiResponse<{ companies: unknown[] }> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch approved companies');
    }

    return data.data?.companies || [];
  } catch (error) {
    console.error('Error fetching approved companies:', error);
    throw error;
  }
};

// Approve company
export const approveCompany = async (userId: number | string) => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/admin/companies/${userId}/approve`, {
      method: 'POST',
    });
    
    const data: ApiResponse<{ user: unknown }> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to approve company');
    }

    return data.data?.user;
  } catch (error) {
    console.error('Error approving company:', error);
    throw error;
  }
};

// Reject company
export const rejectCompany = async (userId: number | string) => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/admin/companies/${userId}/reject`, {
      method: 'POST',
    });
    
    const data: ApiResponse<{ user: unknown }> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to reject company');
    }

    return data.data?.user;
  } catch (error) {
    console.error('Error rejecting company:', error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/admin/users`);
    const data: ApiResponse<{ users: unknown[] }> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }

    return data.data?.users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get all job postings
export const getAllJobPostings = async () => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/admin/job-postings`);
    const data: ApiResponse<{ job_postings: unknown[] }> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch job postings');
    }

    return data.data?.job_postings || [];
  } catch (error) {
    console.error('Error fetching job postings:', error);
    throw error;
  }
};

// Get all applications
export const getAllApplications = async () => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/admin/applications`);
    const data: ApiResponse<{ applications: unknown[] }> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch applications');
    }

    return data.data?.applications || [];
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};
