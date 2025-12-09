'use client'

// Reusable Table Component untuk Job Postings
interface JobPosting {
  id: number;
  title: string;
  location: string;
  salary: string;
  type: string;
  tenure: string;
  status: 'open' | 'closed';
  company: {
    id: number;
    company_name: string;
    company_city: string;
    user: {
      name: string;
      email: string;
    };
  };
  qualifications: Array<{ id: number; name: string }>;
  applications_count?: number;
  created_at: string;
}

interface JobPostingTableProps {
  jobPostings: JobPosting[];
}

export default function JobPostingTable({ jobPostings }: JobPostingTableProps) {
  // Helper function untuk status badge styling
  const getStatusBadge = (status: 'open' | 'closed') => {
    return status === 'open'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider font-sans">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider font-sans">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider font-sans">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider font-sans">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider font-sans">
                Applications
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider font-sans">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider font-sans">
                Posted Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Conditional Rendering - Empty state vs data rows */}
            {jobPostings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-sans">
                  No job postings found
                </td>
              </tr>
            ) : (
              /* Array mapping untuk render table rows */
              jobPostings.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-black font-sans">
                      {job.title}
                    </div>
                    {/* Conditional Rendering - Show qualifications if any */}
                    {job.qualifications.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {job.qualifications.slice(0, 2).map(qual => (
                          <span key={qual.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {qual.name}
                          </span>
                        ))}
                        {job.qualifications.length > 2 && (
                          <span className="text-xs text-gray-500">+{job.qualifications.length - 2}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-sans">{job.company.company_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 font-sans">{job.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 font-sans">{job.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-[#FF851A] font-sans">
                      {job.applications_count || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full font-sans ${getStatusBadge(job.status)}`}>
                      {job.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-sans">
                    {new Date(job.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
