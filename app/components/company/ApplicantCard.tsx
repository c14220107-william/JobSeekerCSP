'use client'

import Link from 'next/link';
import Image from 'next/image';

/**
 * ApplicantCard Component - Reusable Card untuk Applicant
 * 
 * CSP Concepts:
 * - Props: Menerima data applicant dan callback functions
 * - Conditional Rendering: Status badge styling
 * - Event Handling: onClick callbacks untuk actions
 */

interface ApplicantCardProps {
  applicant: {
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
  };
  jobPostingId: number;
  onAccept?: (applicantId: number) => void;
  onReject?: (applicantId: number) => void;
  showActions?: boolean;
}

export default function ApplicantCard({ 
  applicant, 
  jobPostingId,
  onAccept, 
  onReject,
  showActions = true 
}: ApplicantCardProps) {
  
  // Helper function - Conditional styling untuk status badge
  const getStatusStyle = () => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return styles[applicant.status];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
          {applicant.profile.avatar_url ? (
            <Image
              src={applicant.profile.avatar_url}
              alt={applicant.profile.full_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#FF851A] text-white font-bold text-xl font-sora">
              {applicant.profile.full_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Applicant Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-black font-sora">
                {applicant.profile.full_name}
              </h3>
              <p className="text-sm text-gray-600 font-sans">{applicant.user.email}</p>
              {/* Conditional Rendering - Age if available */}
              {applicant.profile.age && (
                <p className="text-sm text-gray-500 font-sans mt-1">
                  Age: {applicant.profile.age} years
                </p>
              )}
            </div>
            
            {/* Status Badge - Conditional Styling */}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold font-sans ${getStatusStyle()}`}>
              {applicant.status.toUpperCase()}
            </span>
          </div>

          {/* Applied Date */}
          <p className="text-sm text-gray-500 font-sans mt-2">
            Applied: {new Date(applicant.applied_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            {/* View Profile Button */}
            <Link
              href={`/company/job-postings/${jobPostingId}/applicants/${applicant.id}`}
              className="px-4 py-2 bg-blue-600 text-white font-sans font-semibold rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200"
            >
              View Profile
            </Link>

            {/* Conditional Rendering - Show CV button if available */}
            {applicant.profile.cv_url && (
              <a
                href={applicant.profile.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-600 text-white font-sans font-semibold rounded-lg hover:bg-gray-700 hover:scale-105 transition-all duration-200"
              >
                View CV
              </a>
            )}

            {/* Conditional Rendering - Action buttons for pending status */}
            {showActions && applicant.status === 'pending' && (
              <>
                {onAccept && (
                  <button
                    onClick={() => onAccept(applicant.id)}
                    className="px-4 py-2 bg-green-600 text-white font-sans font-semibold rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-200"
                  >
                    Accept
                  </button>
                )}
                {onReject && (
                  <button
                    onClick={() => onReject(applicant.id)}
                    className="px-4 py-2 bg-red-600 text-white font-sans font-semibold rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-200"
                  >
                    Reject
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
