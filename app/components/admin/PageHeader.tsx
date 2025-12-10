'use client'



interface PageHeaderProps {
  title: string;
  description?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export default function PageHeader({ title, description, actionButton }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-4xl font-bold text-black font-sora">{title}</h1>
        {description && (
          <p className="mt-2 text-gray-600 font-sans">{description}</p>
        )}
      </div>
      
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="px-6 py-3 bg-[#FF851A] text-white font-sans font-semibold rounded-lg hover:bg-[#FBBF24] hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          {actionButton.icon}
          {actionButton.label}
        </button>
      )}
    </div>
  );
}
