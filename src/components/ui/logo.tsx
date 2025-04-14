
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

export function Logo({ className, size = 'md', withText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn('flex items-center', className)}>
      <div className={cn(
        'flex-shrink-0 rounded-md bg-gradient-to-r from-energy-blue to-energy-green flex items-center justify-center',
        sizeClasses[size]
      )}>
        <img 
          src="/lovable-uploads/de342a36-7bd1-4b74-957c-53b2c6b31900.png" 
          alt="WattWise Logo" 
          className="w-full h-full object-contain p-1"
        />
      </div>
      {withText && (
        <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">WattWise</h1>
      )}
    </div>
  );
}
