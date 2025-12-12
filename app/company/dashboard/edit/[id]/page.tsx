'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CompanyNavbar from '@/app/components/CompanyNavbar';
import Toast from '@/app/components/Toast';
import { getQualifications, getJobPostingById, updateJobPosting, Qualification, CreateJobPostingData } from '@/app/services/jobPostingService';

export default function EditJobPosting() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' }>({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState<CreateJobPostingData>({
    title: '',
    location: '',
    salary: '',
    description: '',
    tenure: '',
    type: '',
    status: 'open',
    qualification_ids: []
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Validate jobId - can be number or UUID string
        if (!jobId || jobId === 'undefined' || jobId === 'null' || jobId.trim() === '') {
          throw new Error('Invalid job posting ID');
        }

        console.log('Loading job posting with ID:', jobId);

        const [jobData, qualsData] = await Promise.all([
          getJobPostingById(jobId),
          getQualifications()
        ]);

        console.log('Loaded job data:', jobData);
        console.log('Loaded qualifications:', qualsData);

        setQualifications(qualsData);

        // Set form data from job posting
        setFormData({
          title: jobData.title,
          location: jobData.location,
          salary: jobData.salary || '',
          description: jobData.description || '',
          tenure: jobData.tenure,
          type: jobData.type,
          status: jobData.status,
          qualification_ids: jobData.qualifications.map(q => q.id)
        });

        setFetchingData(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setToast({
          show: true,
          message: error instanceof Error ? error.message : 'Failed to load job posting',
          type: 'error'
        });
        setFetchingData(false);
      }
    };

    if (jobId && jobId !== 'undefined' && jobId !== 'null') {
      loadData();
    } else {
      setToast({
        show: true,
        message: 'Invalid job posting ID',
        type: 'error'
      });
      setFetchingData(false);
    }
  }, [jobId]);

  const formatRupiah = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');

    // Format with thousands separator
    if (numericValue === '') return '';
    return new Intl.NumberFormat('id-ID').format(parseInt(numericValue));
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatRupiah(rawValue);

    setFormData(prev => ({
      ...prev,
      salary: formattedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateJobPosting(Number(jobId), formData);

      // Show success toast
      setToast({
        show: true,
        message: 'Job posting updated successfully!',
        type: 'success'
      });

      // Redirect to dashboard after delay
      setTimeout(() => {
        router.push('/company/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error updating job posting:', error);
      setToast({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to update job posting',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQualificationToggle = (qualId: number) => {
    setFormData(prev => ({
      ...prev,
      qualification_ids: prev.qualification_ids.includes(qualId)
        ? prev.qualification_ids.filter(id => id !== qualId)
        : [...prev.qualification_ids, qualId]
    }));
  };

  if (fetchingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CompanyNavbar />
        <div className="flex justify-center items-center pt-32">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFAD42] mb-4"></div>
            <p className="text-gray-600 font-sans">Loading job posting data...</p>
          </div>
        </div>
      </div>
    );
  }

  // If form data is still empty after fetching, show error
  if (!formData.title && !fetchingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CompanyNavbar />

        {/* Toast Notification */}
        <Toast
          key={toast.show ? `toast-${toast.message}` : 'toast'}
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 font-sora mb-4">Failed to Load Job Posting</h2>
            <p className="text-gray-600 font-sans mb-6">
              {toast.message || 'Unable to load the job posting data.'}
            </p>
            <button
              onClick={() => router.push('/company/dashboard')}
              className="inline-flex items-center px-6 py-3 bg-[#FF851A] text-white font-sans font-semibold rounded-lg hover:bg-[#FBBF24] transition"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black font-sora">Edit Job Posting</h1>
          <p className="mt-2 text-gray-600 font-sans">Update the details of your job posting</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Job Posting</h1>
            <p className="mt-2 text-gray-600">Update the job posting details</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFAD42] focus:border-transparent"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            {/* Location & Salary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFAD42] focus:border-transparent"
                  placeholder="e.g. Jakarta, Indonesia"
                />
              </div>

              <div>
                <label htmlFor="salary" className="block text-sm font-semibold text-gray-700 mb-2">
                  Salary Range
                </label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleSalaryChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFAD42] focus:border-transparent"
                  placeholder="e.g. 10000000"
                />
                <p className="text-xs text-gray-500 mt-1">Enter numbers only, will be auto-formatted</p>
              </div>
            </div>

            {/* Type & Tenure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFAD42] focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label htmlFor="tenure" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tenure <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="tenure"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFAD42] focus:border-transparent"
                  placeholder="e.g. Permanent, 6 months"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFAD42] focus:border-transparent"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFAD42] focus:border-transparent"
                placeholder="Describe the job role, responsibilities, and requirements..."
              />
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Required Qualifications
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {qualifications.map((qual) => (
                  <label
                    key={qual.id}
                    className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                  >
                    <input
                      type="checkbox"
                      checked={formData.qualification_ids.includes(qual.id)}
                      onChange={() => handleQualificationToggle(qual.id)}
                      className="w-4 h-4 text-[#FFAD42] focus:ring-[#FFAD42] border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{qual.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-sans font-semibold rounded-lg hover:bg-gray-300 hover:scale-105 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#FF851A] text-white font-sans font-semibold rounded-lg hover:bg-[#FBBF24] hover:scale-105 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Job Posting'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
