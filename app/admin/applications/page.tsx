'use client'

import { useState, useEffect } from 'react';
import AdminNavbar from '@/app/components/admin/AdminNavbar';
import PageHeader from '@/app/components/admin/PageHeader';
import SearchBar from '@/app/components/admin/SearchBar';
import StatCard from '@/app/components/admin/StatCard';
import LoadingSpinner from '@/app/components/company/LoadingSpinner';
import Swal from 'sweetalert2';
import { getAllApplications, Application as APIApplication } from '@/app/services/adminService';

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
      setLoading(true);
      
      // Fetch data from API
      const applicationsData = await getAllApplications();
      
      console.log('Applications from API:', applicationsData);
      console.log('Total applications fetched:', applicationsData.length);
      
      // Debug: Check first item structure
      if (applicationsData.length > 0) {
        console.log('First application structure:', applicationsData[0]);
        console.log('First application seeker:', applicationsData[0].seeker);
        console.log('First application jobPosting:', applicationsData[0].jobPosting);
      }
      
      // Transform data to match component structure - with relaxed filter
      const transformedApplications: Application[] = applicationsData
        .map((app: APIApplication, index: number) => {
          console.log(`Processing application ${index}:`, app);
          
          // Check for missing data but don't filter out, just use fallbacks
          if (!app.seeker) {
            console.warn(`Application ${app.id} missing seeker data`);
          }
          if (!app.jobPosting) {
            console.warn(`Application ${app.id} missing jobPosting data`);
          }
          
          return {
            id: app.id,
            seeker: {
              id: app.seeker?.id || 0,
              name: app.seeker?.user?.name || app.seeker?.full_name || 'N/A',
              email: app.seeker?.user?.email || 'N/A',
              profile: {
                phone: app.seeker?.phone,
                cv_path: app.seeker?.cv_url
              }
            },
            jobPosting: {
              id: app.jobPosting?.id ? (typeof app.jobPosting.id === 'string' ? 0 : app.jobPosting.id) : 0,
              title: app.jobPosting?.title || 'N/A',
              company: {
                company_name: app.jobPosting?.company?.name || 'N/A'
              }
            },
            status: app.status || 'pending',
            applied_at: app.created_at
          };
        });
      
      console.log('Transformed applications:', transformedApplications);
      console.log('Total transformed:', transformedApplications.length);
      
      setApplications(transformedApplications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error instanceof Error ? error.message : 'Failed to load applications. Please try again.',
        confirmButtonColor: '#EF4444',
        customClass: {
          confirmButton: 'font-sans font-semibold px-6 py-2.5 rounded-lg',
          title: 'font-sora text-2xl'
        }
      });
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
