import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { signOut } from '../../store/slices/authSlice';
import { Notification } from '../../types';
import { markAsRead } from '../../store/slices/notificationsSlice';
import { Bell, ChevronDown, Menu, User, LogOut, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopBarProps {
  toggleSidebar: () => void;
}

const NotificationItem = ({ notification, onRead }: { notification: Notification; onRead: () => void }) => {
  const getBackgroundColor = () => {
    if (notification.read) return 'bg-gray-50 dark:bg-gray-800';
    return 'bg-blue-50 dark:bg-blue-900/20';
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return 'border-l-4 border-green-500';
      case 'warning':
        return 'border-l-4 border-yellow-500';
      case 'error':
        return 'border-l-4 border-red-500';
      default:
        return 'border-l-4 border-blue-500';
    }
  };

  return (
    <div 
      className={`${getBackgroundColor()} ${getBorderColor()} p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700`}
      onClick={onRead}
    >
      <p className="font-medium text-sm">{notification.title}</p>
      <p className="text-xs text-gray-600 dark:text-gray-300">{notification.message}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
};

const TopBar = ({ toggleSidebar }: TopBarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const notifications = useSelector((state: RootState) => state.notifications.items);
  const unread = useSelector((state: RootState) => state.notifications.unread);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    dispatch(signOut() as any);
    navigate('/login');
  };

  const handleReadNotification = (id: string) => {
    dispatch(markAsRead(id));
  };

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-4">
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-1 text-xs font-bold rounded-full bg-red-500 text-white">
                    {unread}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium">Notifications</h3>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={() => handleReadNotification(notification.id)}
                    />
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="py-2 px-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="ghost" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="hidden md:flex md:flex-col md:items-start">
                  <span className="text-sm font-medium">{user?.email}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => navigate(`/${user?.role}/management`)}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
