import { useState, useContext, useMemo } from "react";
import { GlobalContext } from "../providers/DataProvider";
import Card from "./Card";

export default function Seek() {
  const context = useContext(GlobalContext);
  const allJobs = useMemo(() => context?.data || [], [context?.data]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const jobsPerPage = 6;

  // initial jobs 6
  const displayedJobs = useMemo(() => {
    if (Array.isArray(allJobs) && allJobs.length > 0) {
      return allJobs.slice(0, currentPage * jobsPerPage);
    }
    return [];
  }, [allJobs, currentPage]);

  // buat load more jobs
  const loadMoreJobs = () => {
    if (loading) return;

    setLoading(true);
    setCurrentPage(prev => prev + 1);

    setTimeout(() => setLoading(false), 500); // loading delay
  };

  const hasMoreJobs = displayedJobs.length < allJobs.length;

  return (
    <section className="py-16 px-10 bg-white">
      <h1 className="!text-3xl font-bold mb-4 text-black font-sora text-center">
        SEEK YOUR <span className="text-[#FF851A]">JOBS</span>
      </h1>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(displayedJobs) && displayedJobs.length > 0 ? (
          displayedJobs.map((job) => (
            <Card key={job._id} job={job} />
          ))
        ) : (
          <div className="col-span-full text-center">
            <p className="text-gray-500">No job listings found.</p>
          </div>
        )}
      </div>

      {/* Load More btn */}
      {hasMoreJobs && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMoreJobs}
            disabled={loading}
            className="bg-[#FF851A] hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Loading...
              </>
            ) : (
              <>
                Load More Jobs
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* Message mentok */}
      {!hasMoreJobs && displayedJobs.length > 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-500 text-lg">You&apos;ve seen all job listings!</p>
          <p className="text-gray-400 text-sm mt-2">Total: {displayedJobs.length} jobs</p>
        </div>
      )}
    </section>
  );
}