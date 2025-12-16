'use client'

import { useState, useEffect } from 'react';
import AdminNavbar from '@/app/components/admin/AdminNavbar';
import PageHeader from '@/app/components/admin/PageHeader';
import FilterButtons from '@/app/components/admin/FilterButtons';
import SearchBar from '@/app/components/admin/SearchBar';
import JobPostingTable from '@/app/components/admin/JobPostingTable';
import LoadingSpinner from '@/app/components/company/LoadingSpinner';
import Swal from 'sweetalert2';
import { getAllJobPostings, JobPosting as APIJobPosting } from '@/app/services/adminService';

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
      setLoading(true);
      
      // Fetch data from API
      const jobPostingsData = await getAllJobPostings();
      
      console.log('Job postings from API:', jobPostingsData);
      
     
      const transformedJobPostings: JobPosting[] = jobPostingsData.map((job: APIJobPosting) => ({
        id: parseInt(job.id), 
        title: job.title,
        location: job.location,
        salary: job.salary || 'Negotiable',
        type: job.type,
        tenure: job.tenure,
        status: job.status,
        company: {
          id: job.company.id,
          company_name: job.company.name,
          company_city: job.company.address,
          user: {
            name: job.company.user.name,
            email: job.company.user.email
          }
        },
        qualifications: job.qualifications || [],
        applications_count: job.applications_count || 0,
        created_at: job.created_at
      }));
      
      console.log('Transformed job postings:', transformedJobPostings);
      
      setJobPostings(transformedJobPostings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error instanceof Error ? error.message : 'Failed to load job postings. Please try again.',
        confirmButtonColor: '#EF4444',
        customClass: {
          confirmButton: 'font-sans font-semibold px-6 py-2.5 rounded-lg',
          title: 'font-sora text-2xl'
        }
      });
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
