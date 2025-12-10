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
  company_image_url?: string;
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
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={company.company_image_url || 'https://via.placeholder.com/100'}
            alt={company.company_name}
            fill
            className="object-cover"
          />
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
