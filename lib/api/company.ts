// API utility functions for company panel
// TODO: Update BASE_URL to match your backend API endpoint
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

interface JobPostingData {
  title: string;
  location: string;
  salary?: string;
  description?: string;
  tenure: string;
  type: string;
  status?: 'open' | 'closed';
  qualification_ids?: number[];
}

// Helper function to get auth token
// TODO: Replace with your actual auth token retrieval method
const getAuthToken = (): string | null => {
  // This should get the token from your auth system
  // e.g., from localStorage, cookies, or auth context
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

// Get all job postings for the authenticated company
export const getMyJobPostings = async () => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/company/job-postings`);
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

// Get single job posting by ID
export const getJobPosting = async (id: number | string) => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/company/job-postings/${id}`);
    const data: ApiResponse<{ job_posting: unknown }> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch job posting');
    }

    return data.data?.job_posting;
  } catch (error) {
    console.error('Error fetching job posting:', error);
    throw error;
  }
};

// Create new job posting
export const createJobPosting = async (jobData: JobPostingData) => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/company/job-postings`, {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
    
    const data: ApiResponse<{ job_posting: unknown }> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create job posting');
    }

    return data.data?.job_posting;
  } catch (error) {
    console.error('Error creating job posting:', error);
    throw error;
  }
};

// Update existing job posting
export const updateJobPosting = async (id: number | string, jobData: JobPostingData) => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/company/job-postings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
    
    const data: ApiResponse<{ job_posting: unknown }> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update job posting');
    }

    return data.data?.job_posting;
  } catch (error) {
    console.error('Error updating job posting:', error);
    throw error;
  }
};

// Delete job posting
export const deleteJobPosting = async (id: number | string) => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/company/job-postings/${id}`, {
      method: 'DELETE',
    });
    
    const data: ApiResponse<unknown> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete job posting');
    }

    return data;
  } catch (error) {
    console.error('Error deleting job posting:', error);
    throw error;
  }
};

// Get all qualifications (for dropdown in create/edit forms)
export const getQualifications = async () => {
  try {
    const response = await fetch(`${BASE_URL}/qualifications`);
    const data: ApiResponse<{ qualifications: unknown[] }> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch qualifications');
    }

    return data.data?.qualifications || [];
  } catch (error) {
    console.error('Error fetching qualifications:', error);
    throw error;
  }
};

// Get company details
export const getCompanyDetails = async () => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/company/details`);
    const data: ApiResponse<{ company: unknown }> = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch company details');
    }

    return data.data?.company;
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};
