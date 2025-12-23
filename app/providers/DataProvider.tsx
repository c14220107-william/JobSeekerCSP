'use client'

import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { getUserData, getToken } from "@/app/apiServices";
import ErrorModal from "@/app/components/ErrorModal";

interface Job {
    id: string;
    company_id: string;
    title: string;
    location: string;
    salary: string;
    description: string;
    tenure: string;
    type: string;
    status: string;
    created_at: string;
    updated_at: string;
    applications_count: number;
    is_applied?: boolean;
    company: {
        id: string;
        user_id: string;
        name: string;
        description: string | null;
        address: string | null;
        is_approved: boolean;
        photo_url: string | null;
        created_at: string;
        updated_at: string;
    };
    qualifications: Array<{
        id: string;
        skill: string;
        created_at: string;
        updated_at: string;
        pivot: {
            job_id: string;
            qualification_id: string;
            created_at: string;
            updated_at: string;
        };
    }>;
}

interface GlobalContextType {
    data: Job[];
    setData: React.Dispatch<React.SetStateAction<Job[]>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface DataProviderProps {
    children: ReactNode;
}

// Dummy data for jobs when backend is not available
const dummyJobs: Job[] = [
    {
        id: "1",
        company_id: "1",
        title: "Frontend Developer",
        location: "Jakarta",
        salary: "Rp 8.000.000 - Rp 12.000.000",
        description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces using React and TypeScript.",
        tenure: "Full-time",
        type: "Remote",
        status: "open",
        created_at: "2023-12-01T00:00:00.000000Z",
        updated_at: "2023-12-01T00:00:00.000000Z",
        applications_count: 15,
        is_applied: false,
        company: {
            id: "1",
            user_id: "1",
            name: "TechCorp Indonesia",
            description: "Leading technology company in Indonesia",
            address: "Jakarta Selatan",
            is_approved: true,
            photo_url: "/company-logo1.png",
            created_at: "2023-01-01T00:00:00.000000Z",
            updated_at: "2023-01-01T00:00:00.000000Z",
        },
        qualifications: [
            {
                id: "1",
                skill: "React",
                created_at: "2023-12-01T00:00:00.000000Z",
                updated_at: "2023-12-01T00:00:00.000000Z",
                pivot: {
                    job_id: "1",
                    qualification_id: "1",
                    created_at: "2023-12-01T00:00:00.000000Z",
                    updated_at: "2023-12-01T00:00:00.000000Z",
                },
            },
            {
                id: "2",
                skill: "TypeScript",
                created_at: "2023-12-01T00:00:00.000000Z",
                updated_at: "2023-12-01T00:00:00.000000Z",
                pivot: {
                    job_id: "1",
                    qualification_id: "2",
                    created_at: "2023-12-01T00:00:00.000000Z",
                    updated_at: "2023-12-01T00:00:00.000000Z",
                },
            },
        ],
    },
    {
        id: "2",
        company_id: "2",
        title: "Backend Engineer",
        location: "Bandung",
        salary: "Rp 10.000.000 - Rp 15.000.000",
        description: "Join our backend team to develop scalable APIs using Node.js and Express. Experience with databases is a plus.",
        tenure: "Full-time",
        type: "On-site",
        status: "open",
        created_at: "2023-12-02T00:00:00.000000Z",
        updated_at: "2023-12-02T00:00:00.000000Z",
        applications_count: 8,
        is_applied: true,
        company: {
            id: "2",
            user_id: "2",
            name: "Innovate Solutions",
            description: "Software development company focused on innovation",
            address: "Bandung",
            is_approved: true,
            photo_url: "/company-logo2.png",
            created_at: "2023-02-01T00:00:00.000000Z",
            updated_at: "2023-02-01T00:00:00.000000Z",
        },
        qualifications: [
            {
                id: "3",
                skill: "Node.js",
                created_at: "2023-12-02T00:00:00.000000Z",
                updated_at: "2023-12-02T00:00:00.000000Z",
                pivot: {
                    job_id: "2",
                    qualification_id: "3",
                    created_at: "2023-12-02T00:00:00.000000Z",
                    updated_at: "2023-12-02T00:00:00.000000Z",
                },
            },
            {
                id: "4",
                skill: "Express.js",
                created_at: "2023-12-02T00:00:00.000000Z",
                updated_at: "2023-12-02T00:00:00.000000Z",
                pivot: {
                    job_id: "2",
                    qualification_id: "4",
                    created_at: "2023-12-02T00:00:00.000000Z",
                    updated_at: "2023-12-02T00:00:00.000000Z",
                },
            },
        ],
    },
    {
        id: "3",
        company_id: "3",
        title: "UI/UX Designer",
        location: "Surabaya",
        salary: "Rp 6.000.000 - Rp 9.000.000",
        description: "Create beautiful and intuitive user interfaces for our mobile and web applications. Proficiency in Figma and Adobe XD required.",
        tenure: "Full-time",
        type: "Hybrid",
        status: "open",
        created_at: "2023-12-03T00:00:00.000000Z",
        updated_at: "2023-12-03T00:00:00.000000Z",
        applications_count: 22,
        is_applied: false,
        company: {
            id: "3",
            user_id: "3",
            name: "Creative Studio",
            description: "Design agency specializing in digital experiences",
            address: "Surabaya",
            is_approved: true,
            photo_url: "/company-logo3.png",
            created_at: "2023-03-01T00:00:00.000000Z",
            updated_at: "2023-03-01T00:00:00.000000Z",
        },
        qualifications: [
            {
                id: "5",
                skill: "Figma",
                created_at: "2023-12-03T00:00:00.000000Z",
                updated_at: "2023-12-03T00:00:00.000000Z",
                pivot: {
                    job_id: "3",
                    qualification_id: "5",
                    created_at: "2023-12-03T00:00:00.000000Z",
                    updated_at: "2023-12-03T00:00:00.000000Z",
                },
            },
            {
                id: "6",
                skill: "Adobe XD",
                created_at: "2023-12-03T00:00:00.000000Z",
                updated_at: "2023-12-03T00:00:00.000000Z",
                pivot: {
                    job_id: "3",
                    qualification_id: "6",
                    created_at: "2023-12-03T00:00:00.000000Z",
                    updated_at: "2023-12-03T00:00:00.000000Z",
                },
            },
        ],
    },
    {
        id: "4",
        company_id: "4",
        title: "Data Analyst",
        location: "Yogyakarta",
        salary: "Rp 7.000.000 - Rp 11.000.000",
        description: "Analyze business data to provide insights and support decision-making. Experience with SQL and Python is required.",
        tenure: "Full-time",
        type: "Remote",
        status: "open",
        created_at: "2023-12-04T00:00:00.000000Z",
        updated_at: "2023-12-04T00:00:00.000000Z",
        applications_count: 12,
        is_applied: false,
        company: {
            id: "4",
            user_id: "4",
            name: "Data Insights Co.",
            description: "Data analytics and business intelligence company",
            address: "Yogyakarta",
            is_approved: true,
            photo_url: "/company-logo4.png",
            created_at: "2023-04-01T00:00:00.000000Z",
            updated_at: "2023-04-01T00:00:00.000000Z",
        },
        qualifications: [
            {
                id: "7",
                skill: "SQL",
                created_at: "2023-12-04T00:00:00.000000Z",
                updated_at: "2023-12-04T00:00:00.000000Z",
                pivot: {
                    job_id: "4",
                    qualification_id: "7",
                    created_at: "2023-12-04T00:00:00.000000Z",
                    updated_at: "2023-12-04T00:00:00.000000Z",
                },
            },
            {
                id: "8",
                skill: "Python",
                created_at: "2023-12-04T00:00:00.000000Z",
                updated_at: "2023-12-04T00:00:00.000000Z",
                pivot: {
                    job_id: "4",
                    qualification_id: "8",
                    created_at: "2023-12-04T00:00:00.000000Z",
                    updated_at: "2023-12-04T00:00:00.000000Z",
                },
            },
        ],
    },
];

export const DataProvider = ({ children }: DataProviderProps) => {
    const [data, setData] = useState<Job[]>([]);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchJobPostings = async () => {
            try {
                const token = getToken();
                const user = getUserData();
                
                let url = "http://127.0.0.1:8000/api/job-postings";
                const headers: Record<string, string> = {};
                
                // If user is logged in and not a company, use user-specific endpoint
                if (token && user && user.role !== 'company' && user.user_id) {
                    console.log('User data:', user.user_id);
                    url = `http://127.0.0.1:8000/api/user/job-postings/${user.user_id}`;
                    headers.Authorization = `Bearer ${token}`;
                }
                
                const res = await axios.get(url, { headers });
                console.log('Full response:', res.data);
                console.log('Response structure:', typeof res.data, Array.isArray(res.data) ? 'array' : 'object');

                let jobPostings = [];
                if (Array.isArray(res.data)) {
                    jobPostings = res.data;
                } else if (res.data.data && res.data.data.job_postings) {
                    jobPostings = res.data.data.job_postings;
                } else {
                    console.error('Unexpected API response structure:', res.data);
                    return;
                }

                // Map data dari struktur API
                const jobsData = jobPostings.map((job: Job) => ({
                    ...job, // Use the job data directly as it matches our interface
                }));
                setData(jobsData);
                console.log('Mapped jobs data:', jobsData);
            } catch (err: unknown) {
                console.error('API Error:', err);
                
                // Check if it's a network error
                const axiosError = err as { code?: string; message?: string };
                if (axiosError.code === 'ERR_NETWORK' || axiosError.message?.includes('Network Error') || !navigator.onLine) {
                    setErrorMessage('Backend server is currently unavailable because the Laravel server is not running. The backend application has not been deployed and only the frontend is available. Using dummy data for demonstration.');
                    setShowError(true);
                    // Load dummy data as fallback
                    setData(dummyJobs);
                } else {
                    // For other errors, still show error but don't load dummy
                    setErrorMessage('Failed to load job postings. Please try again later.');
                    setShowError(true);
                }
            }
        };
        
        fetchJobPostings();
    }, []);

    return (
        <>
            <ErrorModal
                show={showError}
                message={errorMessage}
                onClose={() => setShowError(false)}
            />
            <GlobalContext.Provider value={{ data, setData }}>
                {children}
            </GlobalContext.Provider>
        </>
    );
};

export { GlobalContext };