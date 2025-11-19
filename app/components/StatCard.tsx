import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  link?: string;
}

export default function StatCard({ title, value, icon, color, link }: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color} hover:shadow-lg transition`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium uppercase">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
          {link && (
            <Link href={link} className="text-[#FFAD42] hover:text-orange-500 text-sm font-semibold mt-2 inline-block">
              View Details →
            </Link>
          )}
        </div>
        <div className="p-4 rounded-full bg-blue-50">
          {icon}
        </div>
      </div>
    </div>
  );
}
