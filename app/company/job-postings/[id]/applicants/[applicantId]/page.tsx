'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import CompanyNavbar from '@/app/components/CompanyNavbar';
import LoadingSpinner from '@/app/components/company/LoadingSpinner';
import Swal from 'sweetalert2';

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

interface ApplicantProfile {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  profile: {
    full_name: string;
    age?: number;
    bio?: string;
    cv_url?: string;
    avatar_url?: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  applied_at: string;
}

interface JobPosting {
  id: number;
  title: string;
}

export default function ApplicantProfileDetail() {
  const params = useParams();
  const router = useRouter();
  const jobPostingId = Number(params?.id);
  const applicantId = Number(params?.applicantId);

  // useState Hooks - State Management
  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState<ApplicantProfile | null>(null);
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);

  // useEffect Hook - Data fetching on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // TODO: Replace with actual API calls
        // const [applicantRes, jobRes] = await Promise.all([
        //   fetch(`/api/company/applications/${applicantId}`),
        //   fetch(`/api/company/job-postings/${jobPostingId}`)
        // ]);

        // Mock data
        setTimeout(() => {
          setJobPosting({
            id: jobPostingId,
            title: 'Senior Software Engineer'
          });

          setApplicant({
            id: applicantId,
            user: {
              id: 1,
              name: 'John Doe',
              email: 'john.doe@email.com'
            },
            profile: {
              full_name: 'John Doe',
              age: 28,
              bio: 'Experienced software engineer with 5+ years in full-stack development. Passionate about building scalable web applications and learning new technologies. Proficient in React, Node.js, and cloud infrastructure.',
              avatar_url: 'https://via.placeholder.com/200',
              cv_url: '/uploads/cv/john-doe.pdf'
            },
            status: 'pending',
            applied_at: new Date(Date.now() - 86400000).toISOString()
          });

          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading applicant:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [applicantId, jobPostingId]);

  // Event Handler - Accept applicant
  const handleAccept = async () => {
    if (!applicant) return;

    const result = await Swal.fire({
      title: 'Accept This Applicant?',
      text: `You are about to accept ${applicant.profile.full_name} for this position.`,
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

        setApplicant(prev => prev ? { ...prev, status: 'accepted' } : null);

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
  const handleReject = async () => {
    if (!applicant) return;

    const result = await Swal.fire({
      title: 'Reject This Applicant?',
      text: `You are about to reject ${applicant.profile.full_name}.`,
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

        setApplicant(prev => prev ? { ...prev, status: 'rejected' } : null);

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
                {applicant.profile.avatar_url ? (
                  <Image
                    src={applicant.profile.avatar_url}
                    alt={applicant.profile.full_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#FF851A] text-white font-bold text-4xl font-sora">
                    {applicant.profile.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Header Info */}
              <div className="ml-6 flex-1 mt-16">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-black font-sora">
                      {applicant.profile.full_name}
                    </h1>
                    <p className="text-gray-600 font-sans mt-1">{applicant.user.email}</p>
                    {/* Conditional Rendering - Age */}
                    {applicant.profile.age && (
                      <p className="text-gray-500 font-sans mt-1">Age: {applicant.profile.age} years</p>
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
        {applicant.profile.bio && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-black font-sora mb-4">About</h2>
            <p className="text-gray-700 font-sans leading-relaxed">{applicant.profile.bio}</p>
          </div>
        )}

        {/* CV Section - Conditional Rendering */}
        {applicant.profile.cv_url && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-black font-sora mb-4">Curriculum Vitae</h2>
            <a
              href={applicant.profile.cv_url}
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
