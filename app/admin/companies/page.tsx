'use client'

// React Hooks untuk state management
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminNavbar from '@/app/components/admin/AdminNavbar';
import Swal from 'sweetalert2';

// Import Reusable Components
import CompanyCard from '@/app/components/admin/CompanyCard';
import TabNavigation from '@/app/components/admin/TabNavigation';
import LoadingSpinner from '@/app/components/company/LoadingSpinner';
import PageHeader from '@/app/components/company/PageHeader';

// TypeScript Interfaces
interface Company {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    is_approved: boolean;
  };
  company_name: string;
  company_city: string;
  company_description: string;
  company_image_url?: string;
  is_approved: boolean;
  created_at: string;
}

// Main Component - Demonstrasi Client Side Programming
export default function AdminCompanies() {
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get('tab') || 'pending';
  
  // useState Hooks - State Management
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>(initialTab as 'pending' | 'approved' | 'rejected');
  const [loading, setLoading] = useState(true);
  const [pendingCompanies, setPendingCompanies] = useState<Company[]>([]);
  const [approvedCompanies, setApprovedCompanies] = useState<Company[]>([]);

  const loadData = async () => {
    try {
      // TODO: Replace with actual API calls
      // const [pendingRes, approvedRes] = await Promise.all([
      //   fetch('/api/admin/companies/pending'),
      //   fetch('/api/admin/companies/approved')
      // ]);
      
      // Mock data
      setTimeout(() => {
        setPendingCompanies([
          {
            id: 1,
            user: { id: 10, name: 'PT Tech Solutions', email: 'contact@techsolutions.com', is_approved: false },
            company_name: 'Tech Solutions Indonesia',
            company_city: 'Jakarta',
            company_description: 'Leading technology company in Indonesia',
            company_image_url: 'https://via.placeholder.com/150',
            is_approved: false,
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            user: { id: 11, name: 'PT Digital Marketing', email: 'info@digitalmarketing.com', is_approved: false },
            company_name: 'Digital Marketing Pro',
            company_city: 'Bandung',
            company_description: 'Digital marketing agency',
            is_approved: false,
            created_at: new Date().toISOString()
          }
        ]);
        
        setApprovedCompanies([
          {
            id: 3,
            user: { id: 12, name: 'PT Startup Hub', email: 'hello@startuphub.com', is_approved: true },
            company_name: 'Startup Hub Indonesia',
            company_city: 'Surabaya',
            company_description: 'Co-working space and startup incubator',
            company_image_url: 'https://via.placeholder.com/150',
            is_approved: true,
            created_at: new Date().toISOString()
          }
        ]);
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const initLoad = async () => {
      await loadData();
    };
    initLoad();
  }, []);

  const handleAction = async (company: Company, action: 'approve' | 'reject') => {
    // SweetAlert2 Confirmation Dialog
    const result = await Swal.fire({
      title: action === 'approve' ? 'Approve Company?' : 'Reject Company?',
      html: `
        <div class="text-left">
          <p class="text-gray-700 mb-3">Are you sure you want to <strong>${action}</strong> this company?</p>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="font-semibold text-gray-900">${company.company_name}</p>
            <p class="text-sm text-gray-600">${company.company_city}</p>
            <p class="text-sm text-gray-500 mt-2">${company.user.email}</p>
          </div>
        </div>
      `,
      icon: action === 'approve' ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 'approve' ? '#10B981' : '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: action === 'approve' ? 'Yes, Approve!' : 'Yes, Reject!',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'font-sans font-semibold px-6 py-2.5 rounded-lg',
        cancelButton: 'font-sans font-semibold px-6 py-2.5 rounded-lg',
        title: 'font-sora text-2xl',
        htmlContainer: 'font-sans'
      }
    });

    if (result.isConfirmed) {
      try {
        // Show loading
        Swal.fire({
          title: 'Processing...',
          text: 'Please wait',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // TODO: Replace with actual API call
        // await fetch(`/api/admin/companies/${company.user.id}/${action}`, {
        //   method: 'POST'
        // });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (action === 'approve') {
          setPendingCompanies(prev => prev.filter(c => c.id !== company.id));
          setApprovedCompanies(prev => [...prev, { ...company, is_approved: true }]);
        } else {
          setPendingCompanies(prev => prev.filter(c => c.id !== company.id));
        }

        // Success message
        Swal.fire({
          icon: 'success',
          title: action === 'approve' ? 'Company Approved!' : 'Company Rejected!',
          text: `${company.company_name} has been ${action}d successfully.`,
          confirmButtonColor: '#FF851A',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'font-sans font-semibold px-6 py-2.5 rounded-lg',
            title: 'font-sora text-2xl'
          }
        });
      } catch (error) {
        console.error('Error processing company:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to process company. Please try again.',
          confirmButtonColor: '#EF4444',
          customClass: {
            confirmButton: 'font-sans font-semibold px-6 py-2.5 rounded-lg',
            title: 'font-sora text-2xl'
          }
        });
      }
    }
  };

  // Conditional Rendering - Loading State
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

  // Array mapping untuk Tab Navigation - Modern JavaScript
  const tabs = [
    { id: 'pending', label: 'Pending', count: pendingCompanies.length },
    { id: 'approved', label: 'Approved', count: approvedCompanies.length }
  ];

  // Helper function untuk mendapatkan companies sesuai active tab
  const getCurrentCompanies = () => {
    return activeTab === 'pending' ? pendingCompanies : approvedCompanies;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Component: PageHeader - Reusable header component */}
        <PageHeader
          title="Company Management"
          description="Review and manage company registrations"
        />

        {/* Component: TabNavigation - Reusable tab system with Props */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as 'pending' | 'approved')}
          />

          {/* Conditional Rendering - Tab Content */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Conditional Rendering - Empty vs Data */}
              {getCurrentCompanies().length === 0 ? (
                <div className="text-center py-12 text-gray-500 font-sans">
                  No {activeTab} companies
                </div>
              ) : (
                /* Array Mapping - Rendering company list dynamically */
                getCurrentCompanies().map(company => (
                  /* Component: CompanyCard - Reusable card dengan Props dan Callbacks */
                  <CompanyCard
                    key={company.id}
                    company={company}
                    showActions={activeTab === 'pending'}
                    onApprove={() => handleAction(company, 'approve')}
                    onReject={() => handleAction(company, 'reject')}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
