'use client'

import { useState, useEffect } from 'react';
import AdminNavbar from '@/app/components/AdminNavbar';

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
    const initLoad = async () => {
      await loadData();
    };
    initLoad();
  }, []);

  const filteredApplications = applications.filter(app =>
    app.seeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.seeker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobPosting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobPosting.company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex justify-center items-center pt-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFAD42]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black font-sora">Applications</h1>
          <p className="mt-2 text-gray-600 font-sans">View all job applications on the platform</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, job title, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFAD42] focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            <p className="text-sm text-gray-600">Total Applications</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{applications.filter(a => a.status === 'pending').length}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{applications.filter(a => a.status === 'reviewed').length}</p>
            <p className="text-sm text-gray-600">Reviewed</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{applications.filter(a => a.status === 'accepted').length}</p>
            <p className="text-sm text-gray-600">Accepted</p>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No applications found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map(application => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-semibold text-gray-900">{application.seeker.name}</p>
                          <p className="text-sm text-gray-500">{application.seeker.email}</p>
                          {application.seeker.profile?.phone && (
                            <p className="text-sm text-gray-500">{application.seeker.profile.phone}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{application.jobPosting.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{application.jobPosting.company.company_name}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(application.status)}`}>
                          {application.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
