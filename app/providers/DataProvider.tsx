'use client'

import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { getUserData, getToken } from "@/app/apiServices";

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

export const DataProvider = ({ children }: DataProviderProps) => {
    const [data, setData] = useState<Job[]>([]); // dari null jadi []

    useEffect(() => {
        const fetchJobPostings = async () => {
            try {
                const token = getToken();
                const user = getUserData();
                
                let url = "http://127.0.0.1:8000/api/job-postings";
                const headers: any = {};
                
                // If user is logged in and not a company, use user-specific endpoint
                if (token && user && user.role !== 'company' && user.user_id) {
                    console.log('User data:', user.user_id);
                    url = `http://127.0.0.1:8000/api/user/job-postings/${user.user_id}`;
                    headers.Authorization = `Bearer ${token}`;
                }
                
                const res = await axios.get(url, { headers });
                console.log('Full response:', res.data);
                console.log('Response structure:', typeof res.data, Array.isArray(res.data) ? 'array' : 'object');

                // Check if response is array or object
                let jobPostings = [];
                if (Array.isArray(res.data)) {
                    // If res.data is array, use it directly
                    jobPostings = res.data;
                } else if (res.data.data && res.data.data.job_postings) {
                    // If res.data.data.job_postings exists
                    jobPostings = res.data.data.job_postings;
                } else {
                    console.error('Unexpected API response structure:', res.data);
                    return;
                }

                // Map data dari struktur API
                const jobsData = jobPostings.map((job: any) => ({
                    ...job, // Use the job data directly as it matches our interface
                }));
                setData(jobsData);
                console.log('Mapped jobs data:', jobsData);
            } catch (err) {
                console.error('API Error:', err);
            }
        };
        
        fetchJobPostings();
    }, []);

    return (
        <GlobalContext.Provider value={{ data, setData }}>
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContext };