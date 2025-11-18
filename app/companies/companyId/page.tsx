import Link from "next/link";

type Params = { params: { companyId: string } };

type Job = {
  _id: string;
  title: string;
  job_tenure: string;
  job_type: string;
  job_description?: string;
};

async function fetchCompany(id: string) {
  const res = await fetch(`https://final-project-api-alpha.vercel.app/api/companies/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

async function fetchCompanyJobs(id: string) {
  const res = await fetch(`https://final-project-api-alpha.vercel.app/api/jobs?companyId=${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

export default async function CompanyPage({ params }: Params) {
  const { companyId } = params;
  const [company, jobs] = await Promise.all([fetchCompany(companyId), fetchCompanyJobs(companyId)]);

  if (!company) {
    return (
      <main className="p-8">
        <p>Company not found.</p>
        <Link href="/jobs">Back to jobs</Link>
      </main>
    );
  }

  return (
    <main className="p-8">
      <header className="flex items-center gap-6 mb-8">
        <img src={company.logo_url || "/icon.png"} alt={company.name} className="w-24 h-24 object-cover rounded" />
        <div>
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-sm text-gray-600">{company.city}</p>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="font-semibold mb-2">About</h2>
        <p className="text-gray-700">{company.description || "No description available."}</p>
      </section>

      <section>
        <h2 className="font-semibold mb-4">Open Positions</h2>
        {Array.isArray(jobs) && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job: Job) => (
              <article key={job._id} className="p-4 border rounded">
                <h3 className="font-bold">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.job_tenure} • {job.job_type}</p>
                <p className="mt-2 text-gray-700">{job.job_description?.slice(0, 140)}...</p>
                <Link href={`/jobs/${job._id}`} className="text-orange-500 mt-2 inline-block">View</Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No open positions found.</p>
        )}
      </section>
    </main>
  );
}