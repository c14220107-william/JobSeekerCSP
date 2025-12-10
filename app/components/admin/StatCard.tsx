'use client'

// Reusable Stat Card Component dengan Props
interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow' | 'gray';
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  trend,
  color = 'blue' 
}: StatCardProps) {
  // Conditional styling berdasarkan color prop
  const getColorClasses = () => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      orange: 'bg-[#FF851A]',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      gray: 'bg-gray-500'
    };
    return colors[color];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 font-sans">{title}</p>
          <p className="text-3xl font-bold text-black font-sora mt-2">{value}</p>
          
          {/* Conditional Rendering - Trend (optional) */}
          {trend && (
            <p className={`text-sm mt-2 font-sans font-semibold ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        
        {/* Conditional Rendering - Icon (optional) */}
        {icon && (
          <div className={`p-4 rounded-full ${getColorClasses()}`}>
            <div className="text-white w-8 h-8">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
