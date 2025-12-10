'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import CompanyNavbar from '@/app/components/CompanyNavbar';
import ApplicantCard from '@/app/components/company/ApplicantCard';
import Swal from 'sweetalert2';

interface Qualification {
  id: number;
  name: string;
}

interface Application {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  profile: {
    full_name: string;
    age?: number;
    avatar_url?: string;
    cv_url?: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  applied_at: string;
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
  applications: Application[];
  created_at: string;
  updated_at: string;
}

export default function JobPostingDetail() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // TODO: Fetch job posting from API
        // const response = await fetch(`/api/company/job-postings/${jobId}`);
        // const data = await response.json();
        // setJobPosting(data.data.job_posting);
        
        // Mock data
        setTimeout(() => {
          setJobPosting({
            id: Number(jobId),
            title: 'Senior Software Engineer',
            location: 'Jakarta, Indonesia',
            salary: 'Rp 10.000.000 - Rp 15.000.000',
            description: 'We are looking for a talented Senior Software Engineer...',
            tenure: 'Permanent',
            type: 'Full Time',
            status: 'open',
            qualifications: [
              { id: 1, name: 'Bachelor Degree' },
              { id: 2, name: '2+ Years Experience' }
            ],
            applications: [
              {
                id: 1,
                user: {
                  id: 1,
                  name: 'John Doe',
                  email: 'john.doe@email.com'
                },
                profile: {
                  full_name: 'John Doe',
                  age: 28,
                  avatar_url: 'https://via.placeholder.com/100',
                  cv_url: '/uploads/cv/john-doe.pdf'
                },
                status: 'pending',
                applied_at: new Date(Date.now() - 86400000).toISOString()
              },
              {
                id: 2,
                user: {
                  id: 2,
                  name: 'Jane Smith',
                  email: 'jane.smith@email.com'
                },
                profile: {
                  full_name: 'Jane Smith',
                  age: 26,
                  cv_url: '/uploads/cv/jane-smith.pdf'
                },
                status: 'accepted',
                applied_at: new Date(Date.now() - 172800000).toISOString()
              }
            ],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching job posting:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [jobId]);

  // Event Handler - Accept applicant
  const handleAccept = async (applicantId: number) => {
    if (!jobPosting) return;
    const applicant = jobPosting.applications.find(a => a.id === applicantId);
    if (!applicant) return;

    const result = await Swal.fire({
      title: 'Accept Applicant?',
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-3">Are you sure you want to accept this applicant?</p>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="font-semibold text-gray-900">${applicant.profile.full_name}</p>
            <p class="text-sm text-gray-600">${applicant.user.email}</p>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Accept!',
      customClass: {
        confirmButton: 'font-sans font-semibold px-6 py-2.5 rounded-lg',
        cancelButton: 'font-sans font-semibold px-6 py-2.5 rounded-lg',
        title: 'font-sora text-2xl'
      }
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Processing...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        // TODO: API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update state
        setJobPosting(prev => prev ? {
          ...prev,
          applications: prev.applications.map(a =>
            a.id === applicantId ? { ...a, status: 'accepted' as const } : a
          )
        } : null);

        Swal.fire({
          icon: 'success',
          title: 'Applicant Accepted!',
          text: `${applicant.profile.full_name} has been accepted.`,
          confirmButtonColor: '#FF851A',
          customClass: {
            confirmButton: 'font-sans font-semibold px-6 py-2.5 rounded-lg',
            title: 'font-sora text-2xl'
          }
        });
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to accept applicant.',
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

  // Event Handler - Reject applicant
  const handleReject = async (applicantId: number) => {
    if (!jobPosting) return;
    const applicant = jobPosting.applications.find(a => a.id === applicantId);
    if (!applicant) return;

    const result = await Swal.fire({
      title: 'Reject Applicant?',
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-3">Are you sure you want to reject this applicant?</p>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="font-semibold text-gray-900">${applicant.profile.full_name}</p>
            <p class="text-sm text-gray-600">${applicant.user.email}</p>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Reject!',
      customClass: {
        confirmButton: 'font-sans font-semibold px-6 py-2.5 rounded-lg',
        cancelButton: 'font-sans font-semibold px-6 py-2.5 rounded-lg',
        title: 'font-sora text-2xl'
      }
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Processing...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        // TODO: API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setJobPosting(prev => prev ? {
          ...prev,
          applications: prev.applications.map(a =>
            a.id === applicantId ? { ...a, status: 'rejected' as const } : a
          )
        } : null);

        Swal.fire({
          icon: 'success',
          title: 'Applicant Rejected!',
          text: `${applicant.profile.full_name} has been rejected.`,
          confirmButtonColor: '#FF851A',
          customClass: {
            confirmButton: 'font-sans font-semibold px-6 py-2.5 rounded-lg',
            title: 'font-sora text-2xl'
          }
        });
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to reject applicant.',
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

  const handleDelete = async () => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/company/job-postings/${jobId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      
      router.push('/company/dashboard');
    } catch (error) {
      console.error('Error deleting job posting:', error);
      alert('Failed to delete job posting');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CompanyNavbar />
        <div className="flex justify-center items-center pt-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFAD42]"></div>
        </div>
      </div>
    );
  }

  if (!jobPosting) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CompanyNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Job posting not found</h2>
            <Link
              href="/company/dashboard"
              className="mt-4 inline-block text-[#FFAD42] hover:text-orange-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Back Button */}
        <Link
          href="/company/dashboard"
          className="inline-flex items-center text-[#FF851A] hover:text-[#FBBF24] font-sans font-semibold transition-colors duration-200 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details Card */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-black font-sora mb-2">{jobPosting.title}</h1>
                  <div className="flex flex-wrap gap-4 text-gray-600 font-sans">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {jobPosting.location}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {jobPosting.salary || 'Negotiable'}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    jobPosting.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {jobPosting.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Job Type</p>
                  <p className="font-semibold text-gray-900">{jobPosting.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tenure</p>
                  <p className="font-semibold text-gray-900">{jobPosting.tenure}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-black font-sora mb-3">Job Description</h2>
                <p className="text-gray-700 font-sans whitespace-pre-line">{jobPosting.description}</p>
              </div>

              {/* Qualifications */}
              {jobPosting.qualifications && jobPosting.qualifications.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-black font-sora mb-3">Required Qualifications</h2>
                  <div className="flex flex-wrap gap-2">
                    {jobPosting.qualifications.map((qual) => (
                      <span
                        key={qual.id}
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-sans rounded-lg font-medium"
                      >
                        {qual.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Applications Card */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-black font-sora mb-4">
                Applicants ({jobPosting.applications.length})
              </h2>
              
              {jobPosting.applications.length === 0 ? (
                <div className="text-center py-8 text-gray-500 font-sans">
                  No applicants yet
                </div>
              ) : (
                <div className="space-y-4">
                  {jobPosting.applications.map((application) => (
                    <ApplicantCard
                      key={application.id}
                      applicant={application}
                      jobPostingId={jobPosting.id}
                      onAccept={handleAccept}
                      onReject={handleReject}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-black font-sora mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/company/dashboard/edit/${jobPosting.id}`}
                  className="block w-full text-center px-4 py-3 bg-[#FF851A] text-white font-sans font-semibold rounded-lg hover:bg-[#FBBF24] hover:scale-105 transition-all duration-200"
                >
                  Edit Job Posting
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full px-4 py-3 bg-red-600 text-white font-sans font-semibold rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-200"
                >
                  Delete Job Posting
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-black font-sora mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-sans">Total Applications</span>
                  <span className="font-bold text-2xl text-[#FF851A] font-sora">
                    {jobPosting.applications.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-semibold ${jobPosting.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
                    {jobPosting.status === 'open' ? 'Accepting Applications' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Meta Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(jobPosting.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(jobPosting.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Job Posting</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{jobPosting.title}</span>? This action cannot be undone and all applications will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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
