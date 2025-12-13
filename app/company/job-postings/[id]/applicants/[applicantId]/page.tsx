'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import CompanyNavbar from '@/app/components/CompanyNavbar';
import LoadingSpinner from '@/app/components/company/LoadingSpinner';
import Toast from '@/app/components/Toast';
import { getApplicantById, acceptApplicant, rejectApplicant } from '@/app/services/jobPostingService';

/**
 * Applicant Profile Detail Page
 * 
 * CSP Concepts Demonstrated:
 * - useState: State management untuk profile data
 * - useEffect: Data fetching dengan dynamic routing
 * - useParams: Access route parameters
 * - Conditional Rendering: Loading, error, and data states
 * - Event Handling: Accept/Reject actions
 * - Modern JavaScript: Template literals, optional chaining
 */

// Helper function - Convert Laravel storage path to full URL
const getStorageUrl = (path: string | undefined | null): string | null => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `http://127.0.0.1:8000${path}`;
};

interface ApplicantProfile {
  id: string; // UUID string
  seeker: {
    id: number;
    user_id: number;
    full_name: string;      // Profile fields directly here
    age?: number;
    bio?: string;
    cv_url?: string;
    avatar_url?: string;
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

interface JobPosting {
  id: string; // UUID string
  title: string;
}

export default function ApplicantProfileDetail() {
  const params = useParams();
  const router = useRouter();
  
  console.log('=== Component Mounted ===');
  console.log('Raw params:', params);
  
  // IDs are UUID strings, not numbers
  const jobPostingId = params?.id as string;
  const applicantId = params?.applicantId as string;
  
  console.log('Parsed jobPostingId:', jobPostingId);
  console.log('Parsed applicantId:', applicantId);

  // useState Hooks - State Management
  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState<ApplicantProfile | null>(null);
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'warning' });
  const [showConfirmModal, setShowConfirmModal] = useState<{ show: boolean; type: 'accept' | 'reject' }>({ show: false, type: 'accept' });

  // useEffect Hook - Data fetching on mount
  useEffect(() => {
    const loadData = async () => {
      console.log('=== useEffect loadData called ===');
      console.log('Job Posting ID:', jobPostingId);
      console.log('Applicant ID:', applicantId);
      
      try {
        setLoading(true);
        
        // Backend endpoint expects job posting ID, not application ID
        // So we fetch by jobPostingId and then find the application
        const response = await getApplicantById(jobPostingId);
        
        console.log('Full API Response:', response);
        console.log('Applicant ID we are looking for:', applicantId);
        
        // Backend returns: { success: true, data: { applicants: JobPosting } }
        const jobPostingData = response;
        
        console.log('Job Posting Data:', jobPostingData);
        console.log('Applications:', jobPostingData?.applications);
        
        // Find the specific application by applicantId (UUID string comparison)
        if (jobPostingData && jobPostingData.applications && Array.isArray(jobPostingData.applications)) {
          const application = jobPostingData.applications.find((app: any) => String(app.id) === String(applicantId));
          
          console.log('Found application:', application);
          
          if (application) {
            setApplicant(application);
            setJobPosting({
              id: jobPostingData.id,
              title: jobPostingData.title
            });
            setLoading(false);
          } else {
            console.error('Application not found. Available application IDs:', 
              jobPostingData.applications.map((a: any) => a.id));
            setToast({
              show: true,
              message: `Applicant ID ${applicantId} not found in this job posting`,
              type: 'error'
            });
            setLoading(false);
          }
        } else {
          console.error('Invalid data structure:', jobPostingData);
          setToast({
            show: true,
            message: 'Invalid data structure received from server',
            type: 'error'
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading applicant:', error);
        setToast({
          show: true,
          message: error instanceof Error ? error.message : 'Failed to load applicant data',
          type: 'error'
        });
        setLoading(false);
      }
    };

    if (applicantId && jobPostingId) {
      loadData();
    } else {
      console.error('Missing required IDs:', { applicantId, jobPostingId });
      setLoading(false);
    }
  }, [applicantId, jobPostingId]);

  // Event Handler - Show accept confirmation
  const handleAccept = () => {
    setShowConfirmModal({ show: true, type: 'accept' });
  };

  // Event Handler - Confirm accept applicant
  const confirmAccept = async () => {
    if (!applicant) return;

    setShowConfirmModal({ show: false, type: 'accept' });

    try {
      // Call API to accept applicant
      await acceptApplicant(applicantId);

      setApplicant(prev => prev ? { ...prev, status: 'accepted' } : null);

      setToast({ show: true, message: `${applicant.seeker?.full_name || 'Applicant'} has been accepted!`, type: 'success' });
    } catch (error) {
      console.error('Error accepting applicant:', error);
      setToast({ show: true, message: error instanceof Error ? error.message : 'Failed to accept applicant. Please try again.', type: 'error' });
    }
  };

  // Event Handler - Show reject confirmation
  const handleReject = () => {
    setShowConfirmModal({ show: true, type: 'reject' });
  };

  // Event Handler - Confirm reject applicant
  const confirmReject = async () => {
    if (!applicant) return;

    setShowConfirmModal({ show: false, type: 'reject' });

    try {
      // Call API to reject applicant
      await rejectApplicant(applicantId);

      setApplicant(prev => prev ? { ...prev, status: 'rejected' } : null);

      setToast({ show: true, message: `${applicant.seeker?.full_name || 'Applicant'} has been rejected.`, type: 'success' });
    } catch (error) {
      console.error('Error rejecting applicant:', error);
      setToast({ show: true, message: error instanceof Error ? error.message : 'Failed to reject applicant. Please try again.', type: 'error' });
    }
  };

  // Helper function - Status badge styling
  const getStatusStyle = () => {
    if (!applicant) return '';
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return styles[applicant.status];
  };

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

  // Conditional Rendering - Applicant not found
  if (!applicant || !jobPosting) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CompanyNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 font-sora">Applicant Not Found</h2>
            <button
              onClick={() => router.back()}
              className="mt-4 px-6 py-3 bg-[#FF851A] text-white font-sans font-semibold rounded-lg hover:bg-[#FBBF24] transition"
            >
              Go Back
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
      {showConfirmModal.show && applicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-black font-sora mb-4">
              {showConfirmModal.type === 'accept' ? 'Accept This Applicant?' : 'Reject This Applicant?'}
            </h3>
            <p className="text-gray-700 font-sans mb-2">
              You are about to {showConfirmModal.type} <span className="font-semibold">{applicant.seeker?.full_name || 'this applicant'}</span>
              {showConfirmModal.type === 'accept' ? ' for this position.' : '.'}
            </p>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowConfirmModal({ show: false, type: 'accept' })}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-sans font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={showConfirmModal.type === 'accept' ? confirmAccept : confirmReject}
                className={`flex-1 px-6 py-3 text-white font-sans font-semibold rounded-lg transition ${showConfirmModal.type === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
              >
                {showConfirmModal.type === 'accept' ? 'Yes, Accept!' : 'Yes, Reject!'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Back Button */}
        <button
          onClick={() => router.push(`/company/dashboard/${jobPostingId}`)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#FF851A] font-sans font-semibold transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Job Details
        </button>

        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#FF851A] to-[#FBBF24] h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex items-start -mt-16">
              {/* Avatar */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex-shrink-0">
                {getStorageUrl(applicant.seeker?.avatar_url) ? (
                  <Image
                    src={getStorageUrl(applicant.seeker.avatar_url)!}
                    alt={`${applicant.seeker?.full_name || 'Applicant'} profile picture`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#FF851A] text-white font-bold text-4xl font-sora">
                    {applicant.seeker?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>

              {/* Header Info */}
              <div className="ml-6 flex-1 mt-16">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-black font-sora">
                      {applicant.seeker?.full_name || 'Unknown'}
                    </h1>
                    <p className="text-gray-600 font-sans mt-1">{applicant.seeker?.user?.email || 'No email'}</p>
                    {/* Conditional Rendering - Age */}
                    {applicant.seeker?.age && (
                      <p className="text-gray-500 font-sans mt-1">Age: {applicant.seeker.age} years</p>
                    )}
                  </div>

                  {/* Status Badge - Conditional Styling */}
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold font-sans ${getStatusStyle()}`}>
                    {applicant.status.toUpperCase()}
                  </span>
                </div>

                {/* Applied For */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-sans">Applied for:</p>
                  <p className="text-lg font-bold text-black font-sora">{jobPosting.title}</p>
                  <p className="text-sm text-gray-500 font-sans mt-1">
                    Applied on: {new Date(applicant.applied_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section - Conditional Rendering */}
        {applicant.seeker?.bio && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-black font-sora mb-4">About</h2>
            <p className="text-gray-700 font-sans leading-relaxed">{applicant.seeker.bio}</p>
          </div>
        )}

        {/* CV Section - Conditional Rendering */}
        {getStorageUrl(applicant.seeker?.cv_url) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-black font-sora mb-4">Curriculum Vitae</h2>
            <a
              href={getStorageUrl(applicant.seeker.cv_url)!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-sans font-semibold rounded-lg hover:bg-gray-700 hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
              Download CV
            </a>
          </div>
        )}

        {/* Action Buttons - Conditional Rendering based on status */}
        {applicant.status === 'pending' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-black font-sora mb-4">Actions</h2>
            <div className="flex gap-4">
              <button
                onClick={handleAccept}
                className="flex-1 px-6 py-3 bg-green-600 text-white font-sans font-semibold rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-200"
              >
                Accept Applicant
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-sans font-semibold rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-200"
              >
                Reject Applicant
              </button>
            </div>
          </div>
        )}

        {/* Status Info - Conditional Rendering for accepted/rejected */}
        {applicant.status !== 'pending' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className={`p-4 rounded-lg ${applicant.status === 'accepted' ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`font-sans font-semibold ${applicant.status === 'accepted' ? 'text-green-800' : 'text-red-800'}`}>
                This applicant has been {applicant.status}.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
