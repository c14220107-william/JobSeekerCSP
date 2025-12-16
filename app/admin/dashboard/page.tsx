'use client'

// React Hooks untuk state management
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNavbar from '@/app/components/admin/AdminNavbar';
import { getDashboardStats, DashboardStats } from '@/app/services/adminService';
import Swal from 'sweetalert2';

// Import Reusable Components
import StatCard from '@/app/components/admin/StatCard';
import LoadingSpinner from '@/app/components/company/LoadingSpinner';
import PageHeader from '@/app/components/company/PageHeader';

// Main Component dengan Client Side Programming concepts
export default function AdminDashboard() {
  // useState Hooks - State Management
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    total_users: 0,
    total_companies: 0,
    total_approved_companies: 0,
    total_pending_companies: 0,
    total_job_postings: 0,
    total_active_job_postings: 0,
    total_applications: 0,
  });

  // useEffect Hook - Side effects (data fetching on mount)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch real data from API
        const data = await getDashboardStats();
        console.log('Dashboard stats:', data);
        
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error instanceof Error ? error.message : 'Failed to load dashboard statistics. Please try again.',
          confirmButtonColor: '#EF4444',
          customClass: {
            confirmButton: 'font-sans font-semibold px-6 py-2.5 rounded-lg',
            title: 'font-sora text-2xl'
          }
        });
        setLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array = run once on mount

  // Conditional Rendering - Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <LoadingSpinner size="large" color="#FF851A" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Welcome Message */}
        <div className="mb-6 bg-gradient-to-r from-[#FF851A] to-[#FBBF24] rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white font-sora">Welcome to Admin Panel! 👋</h2>
          <p className="text-white/90 font-sans mt-2">Manage your platform with ease. Monitor statistics, review companies, and oversee all activities.</p>
        </div>

        {/* Reusable PageHeader Component */}
        <PageHeader
          title="Admin Dashboard"
          description="Overview of platform statistics"
        />

        {/* Stats Grid - Array of stat configurations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Reusable StatCard Components dengan Props */}
          <StatCard
            title="Total Users"
            value={stats.total_users}
            color="blue"
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            trend={{ value: '+12%', isPositive: true }}
          />

          <StatCard
            title="Total Companies"
            value={stats.total_companies}
            color="purple"
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            trend={{ value: '+8%', isPositive: true }}
          />

          <StatCard
            title="Approved Companies"
            value={stats.total_approved_companies}
            color="green"
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          <StatCard
            title="Pending Approval"
            value={stats.total_pending_companies}
            color="yellow"
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          <StatCard
            title="Total Job Postings"
            value={stats.total_job_postings}
            color="orange"
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            trend={{ value: '+15%', isPositive: true }}
          />

          <StatCard
            title="Active Job Postings"
            value={stats.total_active_job_postings}
            color="green"
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          />

          <StatCard
            title="Total Applications"
            value={stats.total_applications}
            color="red"
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            trend={{ value: '+23%', isPositive: true }}
          />
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-black font-sora mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Action Cards dengan conditional rendering dan dynamic data */}
            <Link
              href="/admin/companies?tab=pending"
              className="flex items-center p-4 border-2 border-yellow-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 hover:scale-105 transition-all duration-200"
            >
              <div className="p-3 bg-yellow-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-black font-sans">Review Companies</p>
                <p className="text-sm text-gray-500 font-sans">{stats.total_pending_companies} pending</p>
              </div>
            </Link>

            <Link
              href="/admin/companies"
              className="flex items-center p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 hover:scale-105 transition-all duration-200"
            >
              <div className="p-3 bg-purple-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-black font-sans">Manage Companies</p>
                <p className="text-sm text-gray-500 font-sans">View all companies</p>
              </div>
            </Link>

            <Link
              href="/admin/job-postings"
              className="flex items-center p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 hover:scale-105 transition-all duration-200"
            >
              <div className="p-3 bg-orange-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-black font-sans">View Job Postings</p>
                <p className="text-sm text-gray-500 font-sans">{stats.total_job_postings} total</p>
              </div>
            </Link>

            <Link
              href="/admin/applications"
              className="flex items-center p-4 border-2 border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 hover:scale-105 transition-all duration-200"
            >
              <div className="p-3 bg-red-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-black font-sans">View Applications</p>
                <p className="text-sm text-gray-500 font-sans">{stats.total_applications} total</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
