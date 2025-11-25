'use client'

import { useState, useEffect } from 'react';
import AdminNavbar from '@/app/components/AdminNavbar';

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
  const [loading, setLoading] = useState(true);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');

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
    const initLoad = async () => {
      await loadData();
    };
    initLoad();
  }, []);

  const filteredJobs = jobPostings.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex justify-center items-center pt-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFAD42]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black font-sora">Job Postings</h1>
          <p className="mt-2 text-gray-600 font-sans">View all job postings on the platform</p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-lg font-sans font-semibold transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-[#FF851A] text-white scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({jobPostings.length})
            </button>
            <button
              onClick={() => setFilter('open')}
              className={`px-5 py-2 rounded-lg font-sans font-semibold transition-all duration-200 ${
                filter === 'open'
                  ? 'bg-[#FF851A] text-white scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Open ({jobPostings.filter(j => j.status === 'open').length})
            </button>
            <button
              onClick={() => setFilter('closed')}
              className={`px-5 py-2 rounded-lg font-sans font-semibold transition-all duration-200 ${
                filter === 'closed'
                  ? 'bg-[#FF851A] text-white scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Closed ({jobPostings.filter(j => j.status === 'closed').length})
            </button>
          </div>
        </div>

        {/* Job Postings List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
              No job postings found
            </div>
          ) : (
            filteredJobs.map(job => (
              <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600 mt-1">{job.company.company_name}</p>
                        
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {job.location}
                          </span>
                          <span>{job.type}</span>
                          <span>{job.tenure}</span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.salary}
                          </span>
                        </div>

                        {job.qualifications.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.qualifications.map(qual => (
                              <span key={qual.id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {qual.name}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span>Applications: <span className="font-semibold text-gray-900">{job.applications_count || 0}</span></span>
                          <span>Posted: {new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      job.status === 'open'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {job.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
