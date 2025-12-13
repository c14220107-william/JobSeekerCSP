'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CompanyNavbar from '@/app/components/CompanyNavbar';
import LoadingSpinner from '@/app/components/company/LoadingSpinner';
import PageHeader from '@/app/components/company/PageHeader';
import ApplicantCard from '@/app/components/company/ApplicantCard';
import Toast from '@/app/components/Toast';

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
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'warning' });
  const [showConfirmModal, setShowConfirmModal] = useState<{ show: boolean; type: 'accept' | 'reject'; applicantId: number | null }>({ show: false, type: 'accept', applicantId: null });

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

  // Event Handler - Show accept confirmation
  const handleAccept = (applicantId: number) => {
    setShowConfirmModal({ show: true, type: 'accept', applicantId });
  };

  // Event Handler - Confirm accept applicant
  const confirmAccept = async () => {
    const applicantId = showConfirmModal.applicantId;
    if (!applicantId) return;

    const applicant = applicants.find(a => a.id === applicantId);
    if (!applicant) return;

    setShowConfirmModal({ show: false, type: 'accept', applicantId: null });

    try {
      // TODO: API call
      // await fetch(`/api/company/applications/${applicantId}/accept`, { method: 'POST' });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update state
      setApplicants(prev => prev.map(a =>
        a.id === applicantId ? { ...a, status: 'accepted' as const } : a
      ));

      setToast({ show: true, message: `${applicant.profile.full_name} has been accepted!`, type: 'success' });
    } catch (error) {
      console.error('Error accepting applicant:', error);
      setToast({ show: true, message: 'Failed to accept applicant. Please try again.', type: 'error' });
    }
  };

  // Event Handler - Show reject confirmation
  const handleReject = (applicantId: number) => {
    setShowConfirmModal({ show: true, type: 'reject', applicantId });
  };

  // Event Handler - Confirm reject applicant
  const confirmReject = async () => {
    const applicantId = showConfirmModal.applicantId;
    if (!applicantId) return;

    const applicant = applicants.find(a => a.id === applicantId);
    if (!applicant) return;

    setShowConfirmModal({ show: false, type: 'reject', applicantId: null });

    try {
      // TODO: API call
      // await fetch(`/api/company/applications/${applicantId}/reject`, { method: 'POST' });

      await new Promise(resolve => setTimeout(resolve, 1000));

      setApplicants(prev => prev.map(a =>
        a.id === applicantId ? { ...a, status: 'rejected' as const } : a
      ));

      setToast({ show: true, message: `${applicant.profile.full_name} has been rejected.`, type: 'success' });
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      setToast({ show: true, message: 'Failed to reject applicant. Please try again.', type: 'error' });
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

      {/* Toast Notification */}
      <Toast
        key={toast.show ? `toast-${toast.message}` : 'toast'}
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* Confirmation Modal */}
      {showConfirmModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-black font-sora mb-4">
              {showConfirmModal.type === 'accept' ? 'Accept Applicant?' : 'Reject Applicant?'}
            </h3>
            <p className="text-gray-700 font-sans mb-6">
              Are you sure you want to {showConfirmModal.type} this applicant?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal({ show: false, type: 'accept', applicantId: null })}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-sans font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={showConfirmModal.type === 'accept' ? confirmAccept : confirmReject}
                className={`flex-1 px-6 py-3 text-white font-sans font-semibold rounded-lg transition ${showConfirmModal.type === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
              >
                {showConfirmModal.type === 'accept' ? 'Accept' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                className={`px-5 py-2 rounded-lg font-sans font-semibold transition-all duration-200 ${filterStatus === filter.id
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
