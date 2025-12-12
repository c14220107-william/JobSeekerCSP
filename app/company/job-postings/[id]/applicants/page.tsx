'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CompanyNavbar from '@/app/components/CompanyNavbar';
import LoadingSpinner from '@/app/components/company/LoadingSpinner';
import PageHeader from '@/app/components/company/PageHeader';
import ApplicantCard from '@/app/components/company/ApplicantCard';
import Swal from 'sweetalert2';

/**
 * View Job Posting Applicants Page
 * 
 * CSP Concepts Demonstrated:
 * - useState: State management untuk applicants data
 * - useEffect: Data fetching on component mount
 * - useParams: Get dynamic route parameters
 * - Array Operations: filter, map untuk render list
 * - Conditional Rendering: Loading, empty state, data display
 * - Event Handling: Accept/Reject callbacks
 * - Component Composition: Using ApplicantCard component
 */

interface Applicant {
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
  type: string;
  status: 'open' | 'closed';
}

export default function ViewJobApplicants() {
  const params = useParams();
  const router = useRouter();
  const jobPostingId = Number(params?.id);

  // useState Hooks - State Management
  const [loading, setLoading] = useState(true);
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  // useEffect Hook - Data fetching
  useEffect(() => {
    const loadData = async () => {
      try {
        // TODO: Replace with actual API calls
        // const [jobRes, applicantsRes] = await Promise.all([
        //   fetch(`/api/company/job-postings/${jobPostingId}`),
        //   fetch(`/api/company/job-postings/${jobPostingId}/applicants`)
        // ]);

        // Mock data
        setTimeout(() => {
          setJobPosting({
            id: jobPostingId,
            title: 'Senior Software Engineer',
            location: 'Jakarta',
            type: 'Full Time',
            status: 'open'
          });

          setApplicants([
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
            },
            {
              id: 3,
              user: {
                id: 3,
                name: 'Michael Johnson',
                email: 'michael.j@email.com'
              },
              profile: {
                full_name: 'Michael Johnson',
                age: 30
              },
              status: 'rejected',
              applied_at: new Date(Date.now() - 259200000).toISOString()
            }
          ]);

          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading applicants:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [jobPostingId]);

  // Event Handler - Accept applicant
  const handleAccept = async (applicantId: number) => {
    const applicant = applicants.find(a => a.id === applicantId);
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
      cancelButtonText: 'Cancel',
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
        // await fetch(`/api/company/applications/${applicantId}/accept`, { method: 'POST' });
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update state
        setApplicants(prev => prev.map(a => 
          a.id === applicantId ? { ...a, status: 'accepted' as const } : a
        ));

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
        console.error('Error accepting applicant:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to accept applicant. Please try again.',
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

  // Event Handler - Reject applicant
  const handleReject = async (applicantId: number) => {
    const applicant = applicants.find(a => a.id === applicantId);
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
      cancelButtonText: 'Cancel',
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
        // await fetch(`/api/company/applications/${applicantId}/reject`, { method: 'POST' });
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        setApplicants(prev => prev.map(a => 
          a.id === applicantId ? { ...a, status: 'rejected' as const } : a
        ));

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
        console.error('Error rejecting applicant:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to reject applicant. Please try again.',
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

  // Array filtering - Filter by status
  const filteredApplicants = applicants.filter(applicant => {
    if (filterStatus === 'all') return true;
    return applicant.status === filterStatus;
  });

  // Conditional Rendering - Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CompanyNavbar />
        <div className="flex justify-center items-center pt-32">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  // Conditional Rendering - Job posting not found
  if (!jobPosting) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CompanyNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 font-sora">Job Posting Not Found</h2>
            <button
              onClick={() => router.push('/company/dashboard')}
              className="mt-4 px-6 py-3 bg-[#FF851A] text-white font-sans font-semibold rounded-lg hover:bg-[#FBBF24] transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Component: PageHeader */}
        <PageHeader
          title={`Applicants for ${jobPosting.title}`}
          description={`${jobPosting.location} • ${jobPosting.type}`}
          actionButton={{
            text: 'Back to Dashboard',
            href: '/company/dashboard'
          }}
        />

        {/* Filter Buttons */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-3 flex-wrap">
            {/* Array of filter options - demonstrating array mapping */}
            {[
              { id: 'all', label: 'All', count: applicants.length },
              { id: 'pending', label: 'Pending', count: applicants.filter(a => a.status === 'pending').length },
              { id: 'accepted', label: 'Accepted', count: applicants.filter(a => a.status === 'accepted').length },
              { id: 'rejected', label: 'Rejected', count: applicants.filter(a => a.status === 'rejected').length }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setFilterStatus(filter.id as typeof filterStatus)}
                className={`px-5 py-2 rounded-lg font-sans font-semibold transition-all duration-200 ${
                  filterStatus === filter.id
                    ? 'bg-[#FF851A] text-white scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Applicants List */}
        <div className="space-y-4">
          {/* Conditional Rendering - Empty state vs data */}
          {filteredApplicants.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 font-sans text-lg">No applicants found</p>
            </div>
          ) : (
            /* Array Mapping - Render applicant cards */
            filteredApplicants.map(applicant => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                jobPostingId={jobPostingId}
                onAccept={handleAccept}
                onReject={handleReject}
                showActions={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
