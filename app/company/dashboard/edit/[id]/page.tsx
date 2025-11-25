'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CompanyNavbar from '@/app/components/CompanyNavbar';

interface Qualification {
  id: number;
  name: string;
}

interface FormData {
  title: string;
  location: string;
  salary: string;
  description: string;
  tenure: string;
  type: string;
  status: 'open' | 'closed';
  qualification_ids: number[];
}

export default function EditJobPosting() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [formData, setFormData] = useState<FormData>({
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
        // TODO: Fetch job posting data and qualifications from API
        // const [jobResponse, qualsResponse] = await Promise.all([
        //   fetch(`/api/company/job-postings/${jobId}`),
        //   fetch('/api/qualifications')
        // ]);
        // const jobData = await jobResponse.json();
        // const qualsData = await qualsResponse.json();
        
        // Mock data
        setQualifications([
          { id: 1, name: 'Bachelor Degree' },
          { id: 2, name: '2+ Years Experience' },
          { id: 3, name: 'Communication Skills' },
          { id: 4, name: 'Leadership' },
          { id: 5, name: 'Problem Solving' }
        ]);
        
        // Mock job data (would come from API)
        // setFormData({
        //   title: jobData.data.job_posting.title,
        //   location: jobData.data.job_posting.location,
        //   salary: jobData.data.job_posting.salary,
        //   description: jobData.data.job_posting.description,
        //   tenure: jobData.data.job_posting.tenure,
        //   type: jobData.data.job_posting.type,
        //   status: jobData.data.job_posting.status,
        //   qualification_ids: jobData.data.job_posting.qualifications.map((q: Qualification) => q.id)
        // });
        
        setFetchingData(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setFetchingData(false);
      }
    };

    loadData();
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/company/job-postings/${jobId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(formData)
      // });
      
      // Mock success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard
      router.push('/company/dashboard');
    } catch (error) {
      console.error('Error updating job posting:', error);
      alert('Failed to update job posting');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFAD42]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyNavbar />
      
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
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFAD42] focus:border-transparent"
                  placeholder="e.g. Rp 10.000.000 - Rp 15.000.000"
                />
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
