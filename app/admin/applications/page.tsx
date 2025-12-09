'use client'

import { useState, useEffect } from 'react';
import AdminNavbar from '@/app/components/admin/AdminNavbar';
import PageHeader from '@/app/components/admin/PageHeader';
import SearchBar from '@/app/components/admin/SearchBar';
import StatCard from '@/app/components/admin/StatCard';
import LoadingSpinner from '@/app/components/company/LoadingSpinner';

interface Application {
  id: number;
  seeker: {
    id: number;
    name: string;
    email: string;
    profile?: {
      phone?: string;
      cv_path?: string;
    };
  };
  jobPosting: {
    id: number;
    title: string;
    company: {
      company_name: string;
    };
  };
  status: string;
  applied_at: string;
}

export default function AdminApplications() {
  // useState Hooks - State Management untuk CSP
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/admin/applications');
      // const data = await response.json();
      // setApplications(data.data.applications);
      
      // Mock data
      setTimeout(() => {
        setApplications([
          {
            id: 1,
            seeker: {
              id: 1,
              name: 'John Doe',
              email: 'john.doe@email.com',
              profile: {
                phone: '08123456789',
                cv_path: '/uploads/cv/john-doe.pdf'
              }
            },
            jobPosting: {
              id: 1,
              title: 'Senior Software Engineer',
              company: {
                company_name: 'Tech Solutions Indonesia'
              }
            },
            status: 'pending',
            applied_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 2,
            seeker: {
              id: 2,
              name: 'Jane Smith',
              email: 'jane.smith@email.com',
              profile: {
                phone: '08234567890'
              }
            },
            jobPosting: {
              id: 2,
              title: 'Digital Marketing Specialist',
              company: {
                company_name: 'Digital Marketing Pro'
              }
            },
            status: 'reviewed',
            applied_at: new Date(Date.now() - 172800000).toISOString()
          },
          {
            id: 3,
            seeker: {
              id: 3,
              name: 'Michael Johnson',
              email: 'michael.j@email.com',
              profile: {}
            },
            jobPosting: {
              id: 1,
              title: 'Senior Software Engineer',
              company: {
                company_name: 'Tech Solutions Indonesia'
              }
            },
            status: 'accepted',
            applied_at: new Date(Date.now() - 259200000).toISOString()
          }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Side Effects - useEffect Hook untuk data loading
    const initLoad = async () => {
      await loadData();
    };
    initLoad();
  }, []);

  // Array filtering dengan Modern JavaScript - Multiple conditions
  const filteredApplications = applications.filter(app =>
    app.seeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.seeker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobPosting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobPosting.company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function untuk status badge colors - Conditional styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Conditional Rendering - Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex justify-center items-center pt-32">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Component: PageHeader - Reusable header dengan Props */}
        <PageHeader
          title="Applications"
          description="View all job applications on the platform"
        />

        {/* Component: SearchBar - Reusable search dengan useState Hook */}
        <SearchBar
          onSearch={setSearchTerm}
          placeholder="Search by name, email, job title, or company..."
        />

        {/* Statistics Cards - Array mapping dengan StatCard component */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Applications"
            value={applications.length}
            color="gray"
          />
          <StatCard
            title="Pending"
            value={applications.filter(a => a.status === 'pending').length}
            color="yellow"
          />
          <StatCard
            title="Reviewed"
            value={applications.filter(a => a.status === 'reviewed').length}
            color="blue"
          />
          <StatCard
            title="Accepted"
            value={applications.filter(a => a.status === 'accepted').length}
            color="green"
          />
        </div>

        {/* Applications Table - Conditional Rendering & Array Mapping */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Conditional Rendering - Empty state vs data */}
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-sans">
              No applications found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-sans">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-sans">
                      Job Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-sans">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-sans">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-sans">
                      Applied Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Array Mapping - Rendering dynamic data */}
                  {filteredApplications.map(application => (
                    <tr key={application.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-semibold text-gray-900 font-sans">{application.seeker.name}</p>
                          <p className="text-sm text-gray-500 font-sans">{application.seeker.email}</p>
                          {/* Conditional Rendering - Optional phone number */}
                          {application.seeker.profile?.phone && (
                            <p className="text-sm text-gray-500 font-sans">{application.seeker.profile.phone}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 font-sans">{application.jobPosting.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-sans">{application.jobPosting.company.company_name}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* Conditional Styling - Dynamic badge color */}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold font-sans ${getStatusColor(application.status)}`}>
                          {application.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-sans">
                        {new Date(application.applied_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
