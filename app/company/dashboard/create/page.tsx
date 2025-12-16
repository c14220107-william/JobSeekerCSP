'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CompanyNavbar from '@/app/components/CompanyNavbar';
import Toast from '@/app/components/Toast';
import { getQualifications, createJobPosting, Qualification, CreateJobPostingData } from '@/app/services/jobPostingService';

export default function CreateJobPosting() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    const loadQualifications = async () => {
      try {
        const data = await getQualifications();
        setQualifications(data);
      } catch (error) {
        console.error('Error fetching qualifications:', error);
        setToast({
          show: true,
          message: error instanceof Error ? error.message : 'Failed to load qualifications',
          type: 'error'
        });
      }
    };
    loadQualifications();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createJobPosting(formData);

      // Show success toast
      setToast({
        show: true,
        message: 'Job posting created successfully!',
        type: 'success'
      });

      // Redirect to dashboard after delay
      setTimeout(() => {
        router.push('/company/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error creating job posting:', error);
      setToast({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to create job posting',
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

  const formatRupiah = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');

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
          <h1 className="text-4xl font-bold text-black font-sora">Create Job Posting</h1>
          <p className="mt-2 text-gray-600 font-sans">Fill in the details to create a new job posting</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
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
                  <option value="Remote">Remote</option>
                  <option value="Onsite">Onsite</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label htmlFor="tenure" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tenure <span className="text-red-500">*</span>
                </label>
                <select
                  id="tenure"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFAD42] focus:border-transparent"
                >
                  <option value="">Select Tenure</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
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
                    <span className="text-sm text-gray-700">{qual.skill}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {/* Submit Buttons */}
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
                {loading ? 'Creating...' : 'Create Job Posting'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
