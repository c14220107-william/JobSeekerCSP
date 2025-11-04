'use client'

import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface Job {
    _id: string;
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
            .get("https://final-project-api-alpha.vercel.app/api/jobs")
            .then((res) => {
                console.log(res.data[0]);
                const jobsData = res.data;
                setData(jobsData);
                console.log(jobsData);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <GlobalContext.Provider value={{ data, setData }}>
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContext };
