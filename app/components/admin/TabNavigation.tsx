'use client'

// Reusable Tab Navigation Component
interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void; // Callback function
}

export default function TabNavigation({ 
  tabs, 
  activeTab, 
  onTabChange 
}: TabNavigationProps) {
  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {/* Array mapping untuk render tabs */}
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-6 py-4 text-sm font-sans font-semibold border-b-2 transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-[#FF851A] text-[#FF851A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {/* Conditional Rendering - Count badge */}
              {tab.count !== undefined && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  activeTab === tab.id
                    ? 'bg-[#FF851A] text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
