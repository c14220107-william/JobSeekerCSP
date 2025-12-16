'use client'

import Link from 'next/link';
import { JobPosting } from '@/app/services/jobPostingService';

// Component dengan Props - Demonstrasi Component Reusability
interface JobPostingCardProps {
  job: JobPosting;
  onDelete: (job: JobPosting) => void; // Callback function sebagai props
}

export default function JobPostingCard({ job, onDelete }: JobPostingCardProps) {
  // Conditional Rendering - menampilkan status badge berdasarkan kondisi
  const getStatusStyle = () => {
    return job.status === 'open'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  // Handler function untuk delete
  const handleDeleteClick = () => {
    onDelete(job);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
      {/* Header Section */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-black font-sora mb-2">{job.title}</h3>

            {/* Location */}
            <div className="flex items-center text-sm text-gray-600 font-sans mb-1">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </div>

            {/* Salary */}
            <div className="flex items-center text-sm text-gray-600 font-sans">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {job.salary || 'Negotiable'}
            </div>
          </div>

          {/* Conditional Rendering - Status Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-sans font-semibold ${getStatusStyle()}`}>
            {job.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Body Section */}
      <div className="px-6 py-4">
        {/* Job Type & Tenure */}
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-gray-600 font-sans">
            <span className="font-semibold">{job.type}</span> • {job.tenure}
          </span>
        </div>

        {/* Applications Count */}
        <div className="flex items-center text-sm text-gray-600 font-sans mb-3">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {job.applications?.length || 0} Applications
        </div>

        {/* Conditional Rendering - Qualifications (hanya tampil jika ada) */}
        {job.qualifications && job.qualifications.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 font-sans mb-2">Required Qualifications:</p>
            <div className="flex flex-wrap gap-1">
              {/* Array mapping - menampilkan max 3 qualifications */}
              {job.qualifications.slice(0, 3).map((qual) => (
                <span
                  key={qual.id}
                  className="px-2 py-1 bg-gray-100 text-gray-700 font-sans text-xs rounded"
                >
                  {qual.skill}
                </span>
              ))}
              {/* Conditional Rendering - tampilkan +N more jika lebih dari 3 */}
              {job.qualifications.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 font-sans text-xs rounded">
                  +{job.qualifications.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions Section */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-2">
        {job.id ? (
          <>
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
          </>
        ) : (
          <>
            <div className="flex-1 text-center px-4 py-2 bg-gray-400 text-white text-sm font-sans font-semibold rounded-md cursor-not-allowed">
              View
            </div>
            <div className="flex-1 text-center px-4 py-2 bg-gray-400 text-white text-sm font-sans font-semibold rounded-md cursor-not-allowed">
              Edit
            </div>
          </>
        )}
        <button
          onClick={handleDeleteClick}
          className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-sans font-semibold rounded-md hover:bg-red-700 hover:scale-105 transition-all duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
