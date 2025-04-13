
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  CalendarClock,
  FileText,
  Grid3X3,
  Home,
  Map,
  Settings,
  ShoppingCart,
  Bell,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User;
}

interface MenuItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  to: string;
  count?: number;
}

const MenuItem = ({ icon: Icon, title, to, count }: MenuItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        'flex items-center space-x-3 px-3 py-2 rounded-md transition-colors',
        isActive
          ? 'bg-primary/10 text-primary dark:bg-energy-blue/10 dark:text-energy-blue'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      )}
    >
      <Icon className={cn('h-5 w-5', isActive ? 'text-primary dark:text-energy-blue' : '')} />
      <span className="text-sm font-medium">{title}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-auto bg-primary/90 dark:bg-energy-blue/90 text-white text-xs py-1 px-2 rounded-full">
          {count}
        </span>
      )}
    </NavLink>
  );
};

const Sidebar = ({ isOpen, setIsOpen, user }: SidebarProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location, isMobile, setIsOpen]);

  // If it's mobile and sidebar is closed, show only a thin strip
  if (isMobile && !isOpen) {
    return (
      <div 
        className="w-12 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-4"
        onClick={() => setIsOpen(true)}
      >
        <ChevronRight className="h-6 w-6 text-gray-500 dark:text-gray-400 cursor-pointer" />
      </div>
    );
  }

  const getMenuItems = () => {
    switch (user.role) {
      case 'generator':
        return [
          { icon: Home, title: 'Dashboard', to: '/generator/dashboard' },
          { icon: CalendarClock, title: 'Schedules', to: '/generator/schedules' },
          { icon: Settings, title: 'Management', to: '/generator/management' },
          { icon: Bell, title: 'Notifications', to: '/generator/notifications', count: 2 },
        ];
      case 'purchaser':
        return [
          { icon: Home, title: 'Dashboard', to: '/purchaser/dashboard' },
          { icon: BarChart3, title: 'Predictions', to: '/purchaser/predictions' },
          { icon: Map, title: 'Grid Map', to: '/purchaser/grid-map' },
          { icon: ShoppingCart, title: 'Purchases', to: '/purchaser/purchases' },
          { icon: FileText, title: 'Reports', to: '/purchaser/reports' },
          { icon: Settings, title: 'Management', to: '/purchaser/management' },
          { icon: Bell, title: 'Notifications', to: '/purchaser/notifications', count: 3 },
        ];
      case 'sldc':
        return [
          { icon: Home, title: 'Dashboard', to: '/sldc/dashboard' },
          { icon: Grid3X3, title: 'Schedules', to: '/sldc/schedules' },
          { icon: FileText, title: 'Reports', to: '/sldc/reports' },
          { icon: Settings, title: 'Management', to: '/sldc/management' },
          { icon: Bell, title: 'Notifications', to: '/sldc/notifications', count: 5 },
        ];
      default:
        return [];
    }
  };

  return (
    <aside 
      className={cn(
        'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-10',
        isMobile ? 'fixed inset-y-0 left-0 shadow-lg' : 'relative',
        isOpen ? 'w-64' : 'w-0 -ml-64'
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-energy-blue flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-energy-blue to-energy-green bg-clip-text text-transparent">
                WattWise
              </h1>
              <p className="text-xs text-gray-500 capitalize">{user.role} Portal</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {getMenuItems().map((item) => (
            <MenuItem
              key={item.to}
              icon={item.icon}
              title={item.title}
              to={item.to}
              count={item.count}
            />
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.state}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
