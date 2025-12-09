'use client'

interface Filter {
  id: string;
  label: string;
  count: number;
}

interface FilterButtonsProps {
  filters: Filter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export default function FilterButtons({ 
  filters, 
  activeFilter, 
  onFilterChange 
}: FilterButtonsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex gap-3 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-5 py-2 rounded-lg font-sans font-semibold transition-all duration-200 ${
              activeFilter === filter.id
                ? 'bg-[#FF851A] text-white scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>
    </div>
  );
}
