'use client'

import Image from 'next/image';

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
  image_url?: string;
  is_approved: boolean;
  created_at: string;
}

interface CompanyCardProps {
  company: Company;
  showActions?: boolean; // Conditional prop untuk menampilkan action buttons
  onApprove?: (company: Company) => void;
  onReject?: (company: Company) => void;
}

// Reusable Company Card Component
export default function CompanyCard({ 
  company, 
  showActions = false,
  onApprove,
  onReject 
}: CompanyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start gap-4">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
          {company.image_url ? (
            <Image
              src={company.image_url}
              alt={company.company_name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-black font-sora truncate">
            {company.company_name}
          </h3>
          <p className="text-gray-600 font-sans text-sm mt-1">{company.company_city}</p>
          <p className="text-gray-700 font-sans mt-2 line-clamp-2">
            {company.company_description}
          </p>
          
          <div className="mt-3 text-sm text-gray-500 font-sans space-y-1">
            <p>
              <span className="font-semibold">Contact:</span> {company.user.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {company.user.email}
            </p>
            <p>
              <span className="font-semibold">Registered:</span>{' '}
              {new Date(company.created_at).toLocaleDateString()}
            </p>
          </div>

          {showActions && onApprove && onReject && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => onApprove(company)}
                className="px-5 py-2 bg-green-600 text-white font-sans font-semibold rounded-md hover:bg-green-700 hover:scale-105 transition-all duration-200"
              >
                Approve
              </button>
              <button
                onClick={() => onReject(company)}
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
}
