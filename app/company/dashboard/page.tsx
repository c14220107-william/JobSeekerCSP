'use client'

// React Hooks - useState dan useEffect untuk state management
import { useState, useEffect } from 'react';
import CompanyNavbar from '@/app/components/CompanyNavbar';

// Import Reusable Components (demonstrasi component composition)
import JobPostingCard from '@/app/components/company/JobPostingCard';
import EmptyState from '@/app/components/company/EmptyState';
import LoadingSpinner from '@/app/components/company/LoadingSpinner';
import ConfirmationModal from '@/app/components/company/ConfirmationModal';
import PageHeader from '@/app/components/company/PageHeader';

// TypeScript Interfaces untuk type safety
interface Qualification {
  id: number;
  name: string;
}

interface JobPosting {
  id: number;
  title: string;
  location: string;
  salary: string;
  description?: string;
  tenure: string;
  type: string;
  status: 'open' | 'closed';
  qualifications: Qualification[];
  applications: Array<unknown>;
  created_at?: string;
}

// Main Component - Demonstrasi Client Side Programming
export default function CompanyDashboard() {
  // useState Hook - State Management untuk data dan UI state
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  // Async function untuk fetch data (Modern JavaScript)
  const fetchJobPostings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/company/job-postings', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const data = await response.json();
      // setJobPostings(data.data.job_postings);
      
      // Mock data untuk demonstrasi (simulasi API call dengan setTimeout)
      setTimeout(() => {
        setJobPostings([
          {
            id: 1,
            title: 'Senior Frontend Developer',
            location: 'Jakarta, Indonesia',
            salary: 'Rp 15.000.000 - Rp 20.000.000',
            description: 'We are looking for an experienced Frontend Developer to join our team.',
            tenure: 'Full-time',
            type: 'Onsite',
            status: 'open',
            qualifications: [
              { id: 1, name: 'React.js' },
              { id: 2, name: 'TypeScript' },
              { id: 3, name: 'Next.js' },
              { id: 4, name: 'Tailwind CSS' }
            ],
            applications: [1, 2, 3, 4, 5],
            created_at: new Date('2024-01-15').toISOString()
          },
          {
            id: 2,
            title: 'Backend Engineer',
            location: 'Bandung, Indonesia',
            salary: 'Rp 12.000.000 - Rp 18.000.000',
            description: 'Join our backend team to build scalable APIs and microservices.',
            tenure: 'Full-time',
            type: 'Hybrid',
            status: 'open',
            qualifications: [
              { id: 5, name: 'Laravel' },
              { id: 6, name: 'PHP' },
              { id: 7, name: 'MySQL' }
            ],
            applications: [1, 2],
            created_at: new Date('2024-01-20').toISOString()
          },
          {
            id: 3,
            title: 'UI/UX Designer',
            location: 'Remote',
            salary: 'Rp 10.000.000 - Rp 15.000.000',
            description: 'Create beautiful and intuitive user interfaces for our products.',
            tenure: 'Full-time',
            type: 'Remote',
            status: 'open',
            qualifications: [
              { id: 8, name: 'Figma' },
              { id: 9, name: 'Adobe XD' },
              { id: 10, name: 'UI Design' }
            ],
            applications: [1, 2, 3],
            created_at: new Date('2024-02-01').toISOString()
          },
          {
            id: 4,
            title: 'DevOps Engineer',
            location: 'Surabaya, Indonesia',
            salary: 'Rp 14.000.000 - Rp 22.000.000',
            description: 'Manage infrastructure and deployment pipelines.',
            tenure: 'Full-time',
            type: 'Onsite',
            status: 'closed',
            qualifications: [
              { id: 11, name: 'Docker' },
              { id: 12, name: 'Kubernetes' },
              { id: 13, name: 'AWS' },
              { id: 14, name: 'CI/CD' }
            ],
            applications: [1],
            created_at: new Date('2024-01-10').toISOString()
          },
          {
            id: 5,
            title: 'Mobile Developer',
            location: 'Jakarta, Indonesia',
            salary: 'Rp 11.000.000 - Rp 16.000.000',
            description: 'Develop cross-platform mobile applications using React Native.',
            tenure: 'Contract',
            type: 'Hybrid',
            status: 'open',
            qualifications: [
              { id: 15, name: 'React Native' },
              { id: 16, name: 'JavaScript' },
              { id: 17, name: 'Mobile Development' }
            ],
            applications: [],
            created_at: new Date('2024-02-05').toISOString()
          }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching job postings:', error);
    }
  };

  // useEffect Hook - Side effects (data fetching saat component mount)
  useEffect(() => {
    const loadData = async () => {
      await fetchJobPostings();
    };
    loadData();
  }, []); // Empty dependency array = run once on mount

  // Event Handler - Delete job posting
  const handleDelete = async (id: number) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/company/job-postings/${id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      
      // Update state (immutable state update pattern)
      setJobPostings(jobPostings.filter(job => job.id !== id));
      setShowDeleteModal(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Error deleting job posting:', error);
    }
  };

  // Event Handler - Open delete modal (lifting state up)
  const openDeleteModal = (job: JobPosting) => {
    setSelectedJob(job);
    setShowDeleteModal(true);
  };

  // Event Handler - Close modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedJob(null);
  };

  // Event Handler - Confirm delete
  const confirmDelete = () => {
    if (selectedJob) {
      handleDelete(selectedJob.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Reusable PageHeader Component dengan Props */}
        <PageHeader
          title="Job Postings"
          description="Manage your company's job postings"
          actionButton={{
            text: 'Create New Job',
            href: '/company/dashboard/create',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )
          }}
        />

        {/* Conditional Rendering - Loading State */}
        {loading ? (
          <LoadingSpinner size="medium" color="#FF851A" />
        ) : (
          <>
            {/* Conditional Rendering - Empty State vs Data Grid */}
            {jobPostings.length === 0 ? (
              <EmptyState
                title="No job postings yet"
                description="Get started by creating your first job posting."
                actionText="Create Job Posting"
                actionLink="/company/dashboard/create"
              />
            ) : (
              /* Job Postings Grid - Array Mapping */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobPostings.map((job) => (
                  <JobPostingCard
                    key={job.id}
                    job={job}
                    onDelete={openDeleteModal}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Reusable ConfirmationModal Component */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Job Posting"
        message={`Are you sure you want to delete "${selectedJob?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
}
