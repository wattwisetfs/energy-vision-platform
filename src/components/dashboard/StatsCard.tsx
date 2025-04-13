
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { DashboardStats } from '@/types';

interface StatsCardProps {
  stats: DashboardStats;
  className?: string;
  icon?: ReactNode;
}

const StatsCard = ({ stats, className, icon }: StatsCardProps) => {
  const getChangeColor = () => {
    if (stats.changeType === 'positive') return 'text-green-500';
    if (stats.changeType === 'negative') return 'text-red-500';
    return 'text-gray-500';
  };

  const getChangePrefix = () => {
    if (stats.changeType === 'positive') return '+';
    if (stats.changeType === 'negative') return '-';
    return '';
  };

  const changeValue = stats.change ? Math.abs(stats.change) : 0;

  return (
    <div className={cn(
      'stats-card bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-5',
      className
    )}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stats.title}</h3>
        {icon && (
          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
            {icon}
          </div>
        )}
      </div>
      
      <div className="mt-2 flex flex-wrap items-baseline">
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {stats.value}
        </span>
        {stats.unit && (
          <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            {stats.unit}
          </span>
        )}

        {stats.change !== undefined && (
          <span className={cn('ml-2 text-sm font-medium', getChangeColor())}>
            {getChangePrefix()}{changeValue}%
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
