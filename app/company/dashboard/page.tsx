'use client'

// React Hooks - useState dan useEffect untuk state management
import { useState, useEffect } from 'react';
import CompanyNavbar from '@/app/components/CompanyNavbar';
import Toast from '@/app/components/Toast';

// Import Reusable Components (demonstrasi component composition)
import JobPostingCard from '@/app/components/company/JobPostingCard';
import EmptyState from '@/app/components/company/EmptyState';
import LoadingSpinner from '@/app/components/company/LoadingSpinner';
import ConfirmationModal from '@/app/components/company/ConfirmationModal';
import PageHeader from '@/app/components/company/PageHeader';

// Import API Services
import { getMyJobPostings, deleteJobPosting, JobPosting } from '@/app/services/jobPostingService';

// Main Component - Demonstrasi Client Side Programming
export default function CompanyDashboard() {
  // useState Hook - State Management untuk data dan UI state
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' }>({ show: false, message: '', type: 'success' });

  // Async function untuk fetch data (Modern JavaScript)
  const fetchJobPostings = async () => {
    try {
      setLoading(true);
      const data = await getMyJobPostings();
      setJobPostings(data);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      setToast({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to fetch job postings',
        type: 'error'
      });
    } finally {
      setLoading(false);
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
      await deleteJobPosting(id);

      // Update state (immutable state update pattern)
      setJobPostings(jobPostings.filter(job => job.id !== id));
      setShowDeleteModal(false);
      setSelectedJob(null);

      // Show success toast
      setToast({
        show: true,
        message: 'Job posting deleted successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting job posting:', error);
      setToast({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to delete job posting',
        type: 'error'
      });
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

      {/* Toast Notification */}
      <Toast
        key={toast.show ? Date.now() : 'toast'}
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

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
