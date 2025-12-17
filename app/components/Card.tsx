import { useState } from "react";
import { getUserData } from "@/app/apiServices";
import { applyToJob } from "@/app/apiServices";
import Toast from "@/app/components/Toast";

interface Job {
  id: string;
  company_id: string;
  title: string;
  location: string;
  salary: string;
  description: string;
  tenure: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  applications_count: number;
  is_applied?: boolean;
  company: {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    address: string | null;
    is_approved: boolean;
    photo_url: string | null;
    created_at: string;
    updated_at: string;
  };
  qualifications: Array<{
    id: string;
    skill: string;
    created_at: string;
    updated_at: string;
    pivot: {
      job_id: string;
      qualification_id: string;
      created_at: string;
      updated_at: string;
    };
  }>;
}

interface CardProps {
  job: Job;
}

export default function Card({ job }: CardProps) {
  const [hoveredJobDesc, setHoveredJobDesc] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(job.is_applied || job.status !== "open");
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const formatSalary = (salary: string) => {
    if (!salary) return "N/A";
    return salary; // Salary is already formatted as string from API
  };

  const getStorageUrl = (path: string | undefined | null): string | null => {
    if (!path) return null;
    // If already full URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // Convert storage path to URL
    return `http://10.108.128.74:8000${path}`;
  };

  return (
    <div className={`relative bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 ${
      job.is_applied 
        ? 'border-green-400 ring-2 ring-green-200' 
        : 'border-gray-200'
    }`}>
      {/* Applied Badge */}
      {job.is_applied && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold">Applied</span>
          </div>
        </div>
      )}
      
      {/* Company Image */}
      <div className={`h-40 overflow-hidden bg-gray-100 relative ${
        job.is_applied ? 'opacity-90' : ''
      }`}>
        {/* Green overlay for applied jobs */}
        {job.is_applied && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20"></div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
            <p className={`font-semibold ${
              job.is_applied ? 'text-green-600' : 'text-[#FF851A]'
            }`}>{job.company.name}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center">
          <svg
            className="w-5 h-5 text-gray-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span className="text-gray-700">
            {formatSalary(job.salary)}
          </span>
        </div>

        <div className="mt-2 flex items-center">
          <svg
            className="w-5 h-5 text-gray-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          <span className="text-gray-700">{job.location}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="col-span-2">
            <h4 className="text-sm font-semibold text-gray-700">
              Qualifications:
            </h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {job.qualifications && job.qualifications.length > 0 ? (
                job.qualifications.map((qual) => (
                  <span
                    key={qual.id}
                    className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded"
                  >
                    {qual.skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-xs">No qualifications specified</span>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700">Tenure:</h4>
            <p className="text-sm text-gray-600">{job.tenure}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700">Type:</h4>
            <p
              className={`text-sm ${job.type === "Remote" ? "text-green-600" : "text-blue-600"
                }`}
            >
              {job.type}
            </p>
          </div>
        </div>

        <div className="mt-3 relative">
          <div
            className="text-sm text-gray-700 cursor-pointer hover:text-[#FF851A] transition"
            onMouseEnter={() => setHoveredJobDesc(true)}
            onMouseLeave={() => setHoveredJobDesc(false)}
          >
            <span className="font-semibold">Job Desc</span>
            <svg
              className="w-4 h-4 inline ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>

          {hoveredJobDesc && (
            <div className="absolute bottom-full left-0 mb-2 bg-black text-white text-xs p-3 rounded-lg shadow-lg w-64 z-10">
              <p>{job.description}</p>
              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
            </div>
          )}
        </div>

        {applied ? (
          <button disabled className="mt-4 w-full !bg-gray-400 text-white font-medium py-2 px-4 rounded transition duration-300">
            {job.status === 'open' ? 'Applied' : 'Closed'}
          </button>
        ) : (
          <>
            <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
            <button
              onClick={async () => {
                const user = getUserData();
                if (!user || user.role !== 'user') {
                  setToast({ show: true, message: 'Please login as a job seeker to apply', type: 'error' });
                  return;
                }

                setApplying(true);
                try {
                  await applyToJob(job.id);
                  setToast({ show: true, message: 'Application submitted!', type: 'success' });
                  setApplied(true);
                } catch (err) {
                  setToast({ show: true, message: err instanceof Error ? err.message : 'Failed to apply', type: 'error' });
                } finally {
                  setApplying(false);
                }
              }}
              className="mt-4 w-full bg-[#FF851A] hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition duration-300 flex items-center justify-center"
              disabled={applying}
            >
              {applying ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Apply Now'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}