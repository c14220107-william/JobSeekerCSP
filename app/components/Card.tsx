import { useState } from "react";

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

  const formatSalary = (salary: string) => {
    if (!salary) return "N/A";
    return salary; // Salary is already formatted as string from API
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      {/* Company Image */}
      <div className="h-40 overflow-hidden bg-gray-100">
        {job.company.photo_url && job.company.photo_url.trim() !== '' ? (
          <img
            src={job.company.photo_url}
            alt={job.company.name}
            className="w-full h-full object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.src =
                "https://via.placeholder.com/400x200?text=Company+Logo";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
        <p className="text-[#FF851A] font-semibold">{job.company.name}</p>

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

        {job.status === "open" ? (
          <button className="mt-4 w-full bg-[#FF851A] hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition duration-300">
            Apply Now
          </button>
        ) : (
          <button className="mt-4 w-full !bg-gray-400 text-white font-medium py-2 px-4 rounded transition duration-300">
            Closed
          </button>
        )}
      </div>
    </div>
  );
}