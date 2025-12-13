'use client'

import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface Job {
    id: string;
    company_id: string;
    title: string;
    company_name: string;
    company_city: string;
    job_qualification: string;
    job_type: string;
    job_tenure: string;
    company_image_url?: string;
    salary_min?: number;
    salary_max?: number;
    job_description?: string;
    job_status?: number;
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
        axios
            .get("http://127.0.0.1:8000/api/job-postings")
            .then((res) => {
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
                    id: job.id,
                    company_id: job.company_id,
                    title: job.title,
                    company_name: job.company?.name || 'Unknown Company',
                    company_city: job.location, // Mengasumsikan location adalah city
                    job_qualification: job.qualifications?.join(', ') || '', // Gabung array menjadi string
                    job_type: job.type,
                    job_tenure: job.tenure,
                    company_image_url: job.company?.photo_url || '',
                    salary_min: job.salary ? parseInt(job.salary.replace(/\./g, '')) : 0, // Konversi string salary ke number
                    salary_max: job.salary ? parseInt(job.salary.replace(/\./g, '')) : 0, // Mengasumsikan salary tunggal sebagai min dan max
                    job_description: job.description,
                    job_status: job.status === 'open' ? 1 : 0, // Konversi status string ke number
                }));
                setData(jobsData);
                console.log('Mapped jobs data:', jobsData);
            })
            .catch((err) => {
                console.error('API Error:', err);
            });
    }, []);

    return (
        <GlobalContext.Provider value={{ data, setData }}>
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContext };