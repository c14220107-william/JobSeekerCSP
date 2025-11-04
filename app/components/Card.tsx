import { useState } from "react";

interface Job {
  _id: string;
  title: string;
  company_name: string;
  company_city: string;
  job_qualification: string;
  job_type: string;
  job_tenure: string;
  company_image_url?: string;
  salary_min?: number;
  salary_max?: number;
  job_description?: string;
  job_status?: number;
}

interface CardProps {
  job: Job;
}

export default function Card({ job }: CardProps) {
  const [hoveredJobDesc, setHoveredJobDesc] = useState(false);

  const formatSalary = (amount: number | undefined) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      {/* Company Image */}
      <div className="h-40 overflow-hidden bg-gray-100">
        <img
          src={job.company_image_url}
          alt={job.company_name}
          className="w-full h-full object-cover"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src =
              "https://via.placeholder.com/400x200?text=Company+Logo";
          }}
        />
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
        <p className="text-[#FF851A] font-semibold">{job.company_name}</p>

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
            {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}
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
          <span className="text-gray-700">{job.company_city}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="col-span-2">
            <h4 className="text-sm font-semibold text-gray-700">
              Qualifications:
            </h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {String(job.job_qualification)
                .split(",")
                .map((qual, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded"
                  >
                    {qual.trim()}
                  </span>
                ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700">Tenure:</h4>
            <p className="text-sm text-gray-600">{job.job_tenure}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700">Type:</h4>
            <p
              className={`text-sm ${job.job_type === "Remote" ? "text-green-600" : "text-blue-600"
                }`}
            >
              {job.job_type}
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
              <p>{job.job_description}</p>
              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
            </div>
          )}
        </div>

        {job.job_status == 1 ? (
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