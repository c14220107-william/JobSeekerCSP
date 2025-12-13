'use client'

import React, { useState, useContext } from "react";
import Card from "../components/Card";
import Footer from "../components/Footer";
import { GlobalContext } from "../providers/DataProvider";

export default function JobPage() {
    const context = useContext(GlobalContext);
    const { data } = context || { data: [] };
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterTenure, setFilterTenure] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const jobsPerPage = 9;

    // Menggunakan useMemo untuk menghindari setState dalam useEffect
    const filteredJobs = React.useMemo(() => {
        return data.filter((job) => {
            const matchesSearch =
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.job_qualification.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType =
                filterType === "all" ||
                job.job_type.toLowerCase() === filterType.toLowerCase();
            const matchesTenure =
                filterTenure === "all" ||
                job.job_tenure.toLowerCase() === filterTenure.toLowerCase();

            return matchesSearch && matchesType && matchesTenure;
        });
    }, [searchQuery, filterType, filterTenure, data]);

    // Reset currentPage to 1 when filters change, dan hitung displayed jobs
    const displayedJobs = React.useMemo(() => {
        // Implicitly reset to page 1 by recalculating from start
        const effectiveCurrentPage = currentPage;
        return filteredJobs.slice(0, effectiveCurrentPage * jobsPerPage);
    }, [filteredJobs, currentPage, jobsPerPage]);

    // Handler untuk reset filter - ini akan otomatis reset currentPage via setter
    const resetFilters = () => {
        setSearchQuery("");
        setFilterType("all");
        setFilterTenure("all");
        setCurrentPage(1);
    };


    const loadMoreJobs = () => {
        if (loading) return;

        setLoading(true);
        setCurrentPage((prev) => prev + 1);
        setTimeout(() => setLoading(false), 500);
    };

    const hasMoreJobs = displayedJobs.length < filteredJobs.length;

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

    };

    if (!context) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-600">Error loading data provider.</p>
        </div>;
    }

    // Show loading if no data yet
    if (data.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Search */}
            <section className="bg-[url('/bg-polos.png')] bg-cover bg-center py-[100px]">
                <div className="container mx-auto px-6">
                    <div className="text-center text-white pt-[25px]">
                        <h1 className="text-5xl font-bold mb-4 font-sora">
                            Find Your Dream Job
                        </h1>
                        <p className="text-xl mb-8 opacity-90">
                            Discover thousands of job opportunities from top companies
                        </p>

                        {/* Search Form */}
                        <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-lg p-4 shadow-lg flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search for jobs, companies, or skills..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 placeholder-gray-500"
                                    />
                                </div>

                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 bg-white"
                                >
                                    <option value="all" className="text-gray-800">
                                        All Types
                                    </option>
                                    <option value="remote" className="text-gray-800">
                                        Remote
                                    </option>
                                    <option value="on-site" className="text-gray-800">
                                        On-site
                                    </option>
                                    <option value="hybrid" className="text-gray-800">
                                        Hybrid
                                    </option>
                                </select>

                                <select
                                    value={filterTenure}
                                    onChange={(e) => setFilterTenure(e.target.value)}
                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 bg-white"
                                >
                                    <option value="all" className="text-gray-800">
                                        All Tenure
                                    </option>
                                    <option value="full-time" className="text-gray-800">
                                        Full-time
                                    </option>
                                    <option value="part-time" className="text-gray-800">
                                        Part-time
                                    </option>
                                    <option value="contract" className="text-gray-800">
                                        Contract
                                    </option>
                                    <option value="internship" className="text-gray-800">
                                        Internship
                                    </option>
                                </select>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className="py-16 px-6">
                <div className="container mx-auto">
                    {/* Results Info */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Job Results</h2>
                            <p className="text-gray-600">
                                Showing {displayedJobs.length} of {filteredJobs.length} jobs
                                {searchQuery && ` for "${searchQuery}"`}
                            </p>
                        </div>

                        {/* Clear Filters */}
                        {(searchQuery ||
                            filterType !== "all" ||
                            filterTenure !== "all") && (
                                <button
                                    onClick={resetFilters}
                                    className="text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-2"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        ></path>
                                    </svg>
                                    Clear all filters
                                </button>
                            )}
                    </div>

                    {/* Job Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(displayedJobs) && displayedJobs.length > 0 ? (
                            displayedJobs.map((job) => (
                                <Card key={job.id} job={job} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <svg
                                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    ></path>
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    No jobs found
                                </h3>
                                <p className="text-gray-500">
                                    Try adjusting your search criteria or filters
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Load More Button */}
                    {hasMoreJobs && (
                        <div className="flex justify-center mt-12">
                            <button
                                onClick={loadMoreJobs}
                                disabled={loading}
                                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        Load More Jobs
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                            ></path>
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* End Message */}
                    {!hasMoreJobs && displayedJobs.length > 0 && (
                        <div className="text-center mt-12">
                            <p className="text-gray-500 text-lg">
                                You&apos;ve seen all matching jobs!
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                Total: {filteredJobs.length} jobs found
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
