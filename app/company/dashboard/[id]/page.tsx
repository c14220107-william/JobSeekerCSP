'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import CompanyNavbar from '@/app/components/CompanyNavbar';
import ApplicantCard from '@/app/components/company/ApplicantCard';
import Toast from '@/app/components/Toast';
import { getJobPostingById, deleteJobPosting, acceptApplicant, rejectApplicant, JobPosting } from '@/app/services/jobPostingService';

// Define Applicant type to match service structure
interface Applicant {
  id: number;
  seeker: {
    id: number;
    user_id: number;
    full_name: string;
    age?: number;
    avatar_url?: string;
    cv_url?: string;
    bio?: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  status: 'pending' | 'accepted' | 'rejected';
  applied_at: string;
  created_at: string;
}

export default function JobPostingDetail() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<{ show: boolean; type: 'accept' | 'reject'; applicantId: number | null }>({ show: false, type: 'accept', applicantId: null });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Validate jobId - can be number or UUID string
        if (!jobId || jobId === 'undefined' || jobId === 'null' || jobId.trim() === '') {
          throw new Error('Invalid job posting ID');
        }

        console.log('Loading job posting detail with ID:', jobId);
        const data = await getJobPostingById(jobId);
        console.log('Loaded job posting detail:', data);
        setJobPosting(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job posting:', error);
        setToast({
          show: true,
          message: error instanceof Error ? error.message : 'Failed to load job posting',
          type: 'error'
        });
        setLoading(false);
      }
    };

    if (jobId && jobId !== 'undefined' && jobId !== 'null' && jobId.trim() !== '') {
      loadData();
    } else {
      setToast({
        show: true,
        message: 'Invalid job posting ID',
        type: 'error'
      });
      setLoading(false);
    }
  }, [jobId]);

  // Event Handler - Show accept confirmation
  const handleAccept = (applicantId: number) => {
    setShowConfirmModal({ show: true, type: 'accept', applicantId });
  };

  // Event Handler - Confirm accept applicant
  const confirmAccept = async () => {
    const applicantId = showConfirmModal.applicantId;
    if (!jobPosting || !applicantId) return;

    const applicant = jobPosting.applications?.find((a) => a.id === applicantId);
    if (!applicant) return;

    setShowConfirmModal({ show: false, type: 'accept', applicantId: null });

    try {
      // Call API to accept applicant
      await acceptApplicant(applicantId);

      // Update state
      setJobPosting(prev => prev ? {
        ...prev,
        applications: prev.applications?.map((a) =>
          a.id === applicantId ? { ...a, status: 'accepted' as const } : a
        )
      } : null);

      setToast({ show: true, message: `${applicant.seeker?.full_name || 'Applicant'} has been accepted!`, type: 'success' });
    } catch (error) {
      console.error('Error accepting applicant:', error);
      setToast({ show: true, message: error instanceof Error ? error.message : 'Failed to accept applicant. Please try again.', type: 'error' });
    }
  };

  // Event Handler - Show reject confirmation
  const handleReject = (applicantId: number) => {
    setShowConfirmModal({ show: true, type: 'reject', applicantId });
  };

  // Event Handler - Confirm reject applicant
  const confirmReject = async () => {
    const applicantId = showConfirmModal.applicantId;
    if (!jobPosting || !applicantId) return;

    const applicant = jobPosting.applications?.find((a) => a.id === applicantId);
    if (!applicant) return;

    setShowConfirmModal({ show: false, type: 'reject', applicantId: null });

    try {
      // Call API to reject applicant
      await rejectApplicant(applicantId);

      setJobPosting(prev => prev ? {
        ...prev,
        applications: prev.applications?.map((a) =>
          a.id === applicantId ? { ...a, status: 'rejected' as const } : a
        )
      } : null);

      setToast({ show: true, message: `${applicant.seeker?.full_name || 'Applicant'} has been rejected.`, type: 'success' });
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      setToast({ show: true, message: error instanceof Error ? error.message : 'Failed to reject applicant. Please try again.', type: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteJobPosting(jobId);

      // Show success toast
      setToast({
        show: true,
        message: 'Job posting deleted successfully!',
        type: 'success'
      });

      // Redirect after delay
      setTimeout(() => {
        router.push('/company/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error deleting job posting:', error);
      setToast({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to delete job posting',
        type: 'error'
      });
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

  if (!jobPosting && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CompanyNavbar />

        {/* Show toast if there's an error message */}
        <Toast
          key={toast.show ? `toast-${toast.message}` : 'toast'}
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="text-center bg-white rounded-lg shadow-md p-12">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 font-sora mb-4">Job Posting Not Found</h2>
            <p className="text-gray-600 font-sans mb-6">
              {toast.message || 'The job posting you are looking for could not be found.'}
            </p>
            <Link
              href="/company/dashboard"
              className="inline-flex items-center px-6 py-3 bg-[#FF851A] text-white font-sans font-semibold rounded-lg hover:bg-[#FBBF24] transition"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
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

      {/* Toast Notification */}
      <Toast
        key={toast.show ? `toast-${toast.message}` : 'toast'}
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* Confirmation Modal */}
      {showConfirmModal.show && jobPosting && (() => {
        const applicant = jobPosting.applications?.find(a => a.id === showConfirmModal.applicantId);
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-black font-sora mb-4">
                {showConfirmModal.type === 'accept' ? 'Accept Applicant?' : 'Reject Applicant?'}
              </h3>
              {applicant && (
                <div className="mb-6">
                  <p className="text-gray-700 font-sans mb-3">
                    Are you sure you want to {showConfirmModal.type} this applicant?
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-900">{applicant.seeker?.full_name || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">{applicant.seeker?.user?.email || 'No email'}</p>
                  </div>
                </div>
              )}
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
        );
      })()}

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

        {jobPosting && (
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
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${jobPosting.status === 'open'
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
                  Applicants ({jobPosting.applications?.length || 0})
                </h2>

                {!jobPosting.applications || jobPosting.applications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 font-sans">
                    No applicants yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobPosting.applications?.map((application) => (
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
                      {jobPosting.applications?.length || 0}
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
                    <p className="text-sm text-gray-500">Updated</p>
                    <p className="font-semibold text-gray-900">
                      {jobPosting.updated_at ? new Date(jobPosting.updated_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && jobPosting && (
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
