'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CompanyNavbar from '@/app/components/CompanyNavbar';

interface Qualification {
  id: number;
  name: string;
}

interface JobPosting {
  id: number;
  title: string;
  location: string;
  salary: string;
  description: string;
  tenure: string;
  type: string;
  status: 'open' | 'closed';
  qualifications: Qualification[];
  applications: Array<unknown>;
  created_at: string;
}

export default function CompanyDashboard() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  const fetchJobPostings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/company/job-postings', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const data = await response.json();
      // setJobPostings(data.data.job_postings);
      
      // Mock data for now
      setTimeout(() => {
        setJobPostings([
          {
            id: 1,
            title: 'Senior Frontend Developer',
            location: 'Jakarta, Indonesia',
            salary: 'Rp 15.000.000 - Rp 20.000.000',
            description: 'We are looking for an experienced Frontend Developer to join our team.',
            tenure: 'Full-time',
            type: 'Onsite',
            status: 'open',
            qualifications: [
              { id: 1, name: 'React.js' },
              { id: 2, name: 'TypeScript' },
              { id: 3, name: 'Next.js' },
              { id: 4, name: 'Tailwind CSS' }
            ],
            applications: [1, 2, 3, 4, 5],
            created_at: new Date('2024-01-15').toISOString()
          },
          {
            id: 2,
            title: 'Backend Engineer',
            location: 'Bandung, Indonesia',
            salary: 'Rp 12.000.000 - Rp 18.000.000',
            description: 'Join our backend team to build scalable APIs and microservices.',
            tenure: 'Full-time',
            type: 'Hybrid',
            status: 'open',
            qualifications: [
              { id: 5, name: 'Laravel' },
              { id: 6, name: 'PHP' },
              { id: 7, name: 'MySQL' }
            ],
            applications: [1, 2],
            created_at: new Date('2024-01-20').toISOString()
          },
          {
            id: 3,
            title: 'UI/UX Designer',
            location: 'Remote',
            salary: 'Rp 10.000.000 - Rp 15.000.000',
            description: 'Create beautiful and intuitive user interfaces for our products.',
            tenure: 'Full-time',
            type: 'Remote',
            status: 'open',
            qualifications: [
              { id: 8, name: 'Figma' },
              { id: 9, name: 'Adobe XD' },
              { id: 10, name: 'UI Design' }
            ],
            applications: [1, 2, 3],
            created_at: new Date('2024-02-01').toISOString()
          },
          {
            id: 4,
            title: 'DevOps Engineer',
            location: 'Surabaya, Indonesia',
            salary: 'Rp 14.000.000 - Rp 22.000.000',
            description: 'Manage infrastructure and deployment pipelines.',
            tenure: 'Full-time',
            type: 'Onsite',
            status: 'closed',
            qualifications: [
              { id: 11, name: 'Docker' },
              { id: 12, name: 'Kubernetes' },
              { id: 13, name: 'AWS' },
              { id: 14, name: 'CI/CD' }
            ],
            applications: [1],
            created_at: new Date('2024-01-10').toISOString()
          },
          {
            id: 5,
            title: 'Mobile Developer',
            location: 'Jakarta, Indonesia',
            salary: 'Rp 11.000.000 - Rp 16.000.000',
            description: 'Develop cross-platform mobile applications using React Native.',
            tenure: 'Contract',
            type: 'Hybrid',
            status: 'open',
            qualifications: [
              { id: 15, name: 'React Native' },
              { id: 16, name: 'JavaScript' },
              { id: 17, name: 'Mobile Development' }
            ],
            applications: [],
            created_at: new Date('2024-02-05').toISOString()
          }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      setLoading(false);
    }
  };

  // Fetch job postings on mount
  useEffect(() => {
    const loadData = async () => {
      await fetchJobPostings();
    };
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/company/job-postings/${id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      
      setJobPostings(jobPostings.filter(job => job.id !== id));
      setShowDeleteModal(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Error deleting job posting:', error);
    }
  };

  const openDeleteModal = (job: JobPosting) => {
    setSelectedJob(job);
    setShowDeleteModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black font-sora">Job Postings</h1>
            <p className="mt-2 text-gray-600 font-sans">Manage your company&apos;s job postings</p>
          </div>
          <Link
            href="/company/dashboard/create"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-[#FF851A] text-white font-sans font-semibold rounded-lg hover:bg-[#FBBF24] hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Job
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFAD42]"></div>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {jobPostings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-xl font-bold text-black font-sora mb-2">No job postings yet</h3>
                <p className="text-gray-500 font-sans mb-6">Get started by creating your first job posting.</p>
                <Link
                  href="/company/dashboard/create"
                  className="inline-flex items-center px-6 py-3 bg-[#FF851A] text-white font-sans font-semibold rounded-lg hover:bg-[#FBBF24] hover:scale-105 transition-all duration-200"
                >
                  Create Job Posting
                </Link>
              </div>
            ) : (
              /* Job Postings Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobPostings.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
                  >
                    {/* Status Badge */}
                    <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.salary || 'Negotiable'}
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

                    {/* Job Details */}
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-gray-600">
                          <span className="font-semibold">{job.type}</span> • {job.tenure}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {job.applications?.length || 0} Applications
                      </div>

                      {/* Qualifications */}
                      {job.qualifications && job.qualifications.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">Required Qualifications:</p>
                          <div className="flex flex-wrap gap-1">
                            {job.qualifications.slice(0, 3).map((qual) => (
                              <span
                                key={qual.id}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {qual.name}
                              </span>
                            ))}
                            {job.qualifications.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                +{job.qualifications.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                      <Link
                        href={`/company/dashboard/${job.id}`}
                        className="flex-1 text-center px-4 py-2 bg-blue-600 text-white text-sm font-sans font-semibold rounded-md hover:bg-blue-700 hover:scale-105 transition-all duration-200"
                      >
                        View
                      </Link>
                      <Link
                        href={`/company/dashboard/edit/${job.id}`}
                        className="flex-1 text-center px-4 py-2 bg-[#FF851A] text-white text-sm font-sans font-semibold rounded-md hover:bg-[#FBBF24] hover:scale-105 transition-all duration-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => openDeleteModal(job)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-sans font-semibold rounded-md hover:bg-red-700 hover:scale-105 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Job Posting</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{selectedJob.title}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedJob(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedJob.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
