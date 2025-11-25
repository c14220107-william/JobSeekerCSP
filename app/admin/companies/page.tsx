'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import AdminNavbar from '@/app/components/AdminNavbar';

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

export default function AdminCompanies() {
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get('tab') || 'pending';
  
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>(initialTab as 'pending' | 'approved' | 'rejected');
  const [loading, setLoading] = useState(true);
  const [pendingCompanies, setPendingCompanies] = useState<Company[]>([]);
  const [approvedCompanies, setApprovedCompanies] = useState<Company[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');

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
    setSelectedCompany(company);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedCompany) return;

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/admin/companies/${selectedCompany.user.id}/${modalAction}`, {
      //   method: 'POST'
      // });

      if (modalAction === 'approve') {
        setPendingCompanies(prev => prev.filter(c => c.id !== selectedCompany.id));
        setApprovedCompanies(prev => [...prev, { ...selectedCompany, is_approved: true }]);
      } else {
        setPendingCompanies(prev => prev.filter(c => c.id !== selectedCompany.id));
      }

      setShowModal(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error('Error processing company:', error);
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

  const CompanyCard = ({ company }: { company: Company }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start gap-4">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden">
          <Image
            src={company.company_image_url || 'https://via.placeholder.com/100'}
            alt={company.company_name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-black font-sora">{company.company_name}</h3>
          <p className="text-gray-600 font-sans text-sm mt-1">{company.company_city}</p>
          <p className="text-gray-700 font-sans mt-2 line-clamp-2">{company.company_description}</p>
          
          <div className="mt-3 text-sm text-gray-500 font-sans">
            <p><span className="font-semibold">Contact:</span> {company.user.name}</p>
            <p><span className="font-semibold">Email:</span> {company.user.email}</p>
            <p><span className="font-semibold">Registered:</span> {new Date(company.created_at).toLocaleDateString()}</p>
          </div>

          {activeTab === 'pending' && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleAction(company, 'approve')}
                className="px-5 py-2 bg-green-600 text-white font-sans font-semibold rounded-md hover:bg-green-700 hover:scale-105 transition-all duration-200"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(company, 'reject')}
                className="px-5 py-2 bg-red-600 text-white font-sans font-semibold rounded-md hover:bg-red-700 hover:scale-105 transition-all duration-200"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black font-sora">Company Management</h1>
          <p className="mt-2 text-gray-600 font-sans">Review and manage company registrations</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition ${
                  activeTab === 'pending'
                    ? 'border-[#FFAD42] text-[#FFAD42]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending ({pendingCompanies.length})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition ${
                  activeTab === 'approved'
                    ? 'border-[#FFAD42] text-[#FFAD42]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Approved ({approvedCompanies.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {pendingCompanies.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No pending companies
                  </div>
                ) : (
                  pendingCompanies.map(company => (
                    <CompanyCard key={company.id} company={company} />
                  ))
                )}
              </div>
            )}

            {activeTab === 'approved' && (
              <div className="space-y-4">
                {approvedCompanies.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No approved companies
                  </div>
                ) : (
                  approvedCompanies.map(company => (
                    <CompanyCard key={company.id} company={company} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {modalAction === 'approve' ? 'Approve Company?' : 'Reject Company?'}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {modalAction} <span className="font-semibold">{selectedCompany.company_name}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedCompany(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 font-semibold rounded-md transition ${
                  modalAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {modalAction === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
