import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, subValue, icon: Icon, trend, color = 'blue' }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
        </div>
        {trend && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                trend === 'up' ? 'bg-green-100 text-green-700' : 
                trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            }`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '-'}
            </span>
        )}
      </div>
    </div>
  );
};

export default KPICard;