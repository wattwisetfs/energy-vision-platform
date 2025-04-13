
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { markAsRead, clearAllNotifications } from '@/store/slices/notificationsSlice';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash2, RefreshCw } from 'lucide-react';
import { Notification } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NotificationItem = ({ notification, onMarkRead }: { notification: Notification, onMarkRead: () => void }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          <Check className="h-4 w-4" />
        </div>;
      case 'warning':
        return <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
          <Bell className="h-4 w-4" />
        </div>;
      case 'error':
        return <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <Bell className="h-4 w-4" />
        </div>;
      default:
        return <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <Bell className="h-4 w-4" />
        </div>;
    }
  };

  const getBorderColor = () => {
    if (notification.read) return '';
    switch (notification.type) {
      case 'success': return 'border-l-4 border-green-500';
      case 'warning': return 'border-l-4 border-yellow-500';
      case 'error': return 'border-l-4 border-red-500';
      default: return 'border-l-4 border-blue-500';
    }
  };

  return (
    <div className={`p-4 mb-3 bg-white dark:bg-gray-800 rounded-lg shadow ${getBorderColor()}`}>
      <div className="flex items-start">
        {getIcon()}
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-start">
            <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {notification.message}
          </p>
          {!notification.read && (
            <Button variant="ghost" size="sm" className="mt-2" onClick={onMarkRead}>
              <Check className="mr-1 h-4 w-4" />
              Mark as read
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const GeneratorNotifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.items);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
    toast({
      title: "Notifications cleared",
      description: "All notifications have been removed.",
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                {unreadCount} new
              </span>
            )}
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-1 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearAll} className="text-red-600 hover:text-red-700">
              <Trash2 className="mr-1 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Your Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread">
                  Unread
                  {unreadCount > 0 && (
                    <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 rounded-full dark:bg-blue-900 dark:text-blue-300">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="success">Success</TabsTrigger>
                <TabsTrigger value="warning">Warnings</TabsTrigger>
                <TabsTrigger value="error">Errors</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium mb-1">No notifications</h3>
                    <p className="text-gray-500">
                      {activeTab === 'all' 
                        ? "You don't have any notifications yet." 
                        : activeTab === 'unread' 
                          ? "You don't have any unread notifications." 
                          : `You don't have any ${activeTab} notifications.`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredNotifications.map((notification) => (
                      <NotificationItem 
                        key={notification.id} 
                        notification={notification}
                        onMarkRead={() => handleMarkAsRead(notification.id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default GeneratorNotifications;
