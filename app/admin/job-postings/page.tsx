'use client'

import { useState, useEffect } from 'react';
import AdminNavbar from '@/app/components/admin/AdminNavbar';
import PageHeader from '@/app/components/admin/PageHeader';
import FilterButtons from '@/app/components/admin/FilterButtons';
import SearchBar from '@/app/components/admin/SearchBar';
import JobPostingTable from '@/app/components/admin/JobPostingTable';
import LoadingSpinner from '@/app/components/company/LoadingSpinner';

interface JobPosting {
  id: number;
  title: string;
  location: string;
  salary: string;
  type: string;
  tenure: string;
  status: 'open' | 'closed';
  company: {
    id: number;
    company_name: string;
    company_city: string;
    user: {
      name: string;
      email: string;
    };
  };
  qualifications: Array<{ id: number; name: string }>;
  applications_count?: number;
  created_at: string;
}

export default function AdminJobPostings() {
  // useState Hooks - State Management untuk CSP
  const [loading, setLoading] = useState(true);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/admin/job-postings');
      // const data = await response.json();
      // setJobPostings(data.data.job_postings);
      
      // Mock data
      setTimeout(() => {
        setJobPostings([
          {
            id: 1,
            title: 'Senior Software Engineer',
            location: 'Jakarta',
            salary: 'Rp 10.000.000 - Rp 15.000.000',
            type: 'Full Time',
            tenure: 'Permanent',
            status: 'open',
            company: {
              id: 1,
              company_name: 'Tech Solutions Indonesia',
              company_city: 'Jakarta',
              user: { name: 'PT Tech Solutions', email: 'contact@techsolutions.com' }
            },
            qualifications: [
              { id: 1, name: 'Bachelor Degree' },
              { id: 2, name: '3+ Years Experience' }
            ],
            applications_count: 15,
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            title: 'Digital Marketing Specialist',
            location: 'Bandung',
            salary: 'Rp 7.000.000 - Rp 10.000.000',
            type: 'Full Time',
            tenure: 'Contract',
            status: 'open',
            company: {
              id: 2,
              company_name: 'Digital Marketing Pro',
              company_city: 'Bandung',
              user: { name: 'PT Digital Marketing', email: 'info@digitalmarketing.com' }
            },
            qualifications: [
              { id: 3, name: 'Social Media Skills' }
            ],
            applications_count: 23,
            created_at: new Date().toISOString()
          },
          {
            id: 3,
            title: 'Product Manager',
            location: 'Surabaya',
            salary: 'Negotiable',
            type: 'Full Time',
            tenure: 'Permanent',
            status: 'closed',
            company: {
              id: 3,
              company_name: 'Startup Hub Indonesia',
              company_city: 'Surabaya',
              user: { name: 'PT Startup Hub', email: 'hello@startuphub.com' }
            },
            qualifications: [],
            applications_count: 8,
            created_at: new Date().toISOString()
          }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Side Effects - useEffect Hook untuk data loading
    const initLoad = async () => {
      await loadData();
    };
    initLoad();
  }, []);

  // Array filtering - Modern JavaScript untuk filter data berdasarkan status dan search
  const filteredJobs = jobPostings.filter(job => {
    // Filter by status
    const matchesStatus = filter === 'all' || job.status === filter;
    
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Conditional Rendering - Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex justify-center items-center pt-32">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  // Array mapping untuk filter buttons configuration
  const filterOptions = [
    { id: 'all', label: 'All', count: jobPostings.length },
    { id: 'open', label: 'Open', count: jobPostings.filter(j => j.status === 'open').length },
    { id: 'closed', label: 'Closed', count: jobPostings.filter(j => j.status === 'closed').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Component: PageHeader - Reusable component dengan Props */}
        <PageHeader
          title="Job Postings"
          description="View all job postings on the platform"
        />

        {/* Component: SearchBar - Search functionality dengan useState Hook */}
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search by job title, company, location, or type..."
        />

        {/* Component: FilterButtons - Reusable filter dengan State Management */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <FilterButtons
            filters={filterOptions}
            activeFilter={filter}
            onFilterChange={(filterId) => setFilter(filterId as 'all' | 'open' | 'closed')}
          />
        </div>

        {/* Component: JobPostingTable - Reusable table dengan Conditional Rendering */}
        <JobPostingTable jobPostings={filteredJobs} />
      </div>
    </div>
  );
}
