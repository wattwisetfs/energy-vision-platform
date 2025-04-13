
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { format } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle2, Filter, Search, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Notification } from '@/types';

// Define the notification type enum for better type safety
type NotificationTypeEnum = 'info' | 'success' | 'warning' | 'error';

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Schedule Submitted',
    message: 'SolarTech Power has submitted a new generation schedule for approval',
    type: 'info',
    read: false,
    createdAt: new Date('2025-04-13T10:30:00')
  },
  {
    id: '2',
    title: 'Report Requires Correction',
    message: 'The submitted report from Energy Distribution Co needs corrections',
    type: 'warning',
    read: false,
    createdAt: new Date('2025-04-12T15:45:00')
  },
  {
    id: '3',
    title: 'System Update',
    message: 'WattWise platform will undergo scheduled maintenance tonight from 2:00 AM to 4:00 AM',
    type: 'info',
    read: true,
    createdAt: new Date('2025-04-12T09:15:00')
  },
  {
    id: '4',
    title: 'Critical Alert: Power Shortage',
    message: 'Projected power shortage in Northern region. Please review emergency protocols.',
    type: 'error',
    read: false,
    createdAt: new Date('2025-04-11T18:22:00')
  },
  {
    id: '5',
    title: 'Report Verified',
    message: 'The quarterly report from Industrial Power has been successfully verified',
    type: 'success',
    read: true,
    createdAt: new Date('2025-04-10T11:05:00')
  }
];

const SldcNotifications = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
    
    toast({
      title: 'Notification marked as read',
      description: 'The notification has been marked as read.',
    });
  };
  
  const handleDelete = (notificationId: string) => {
    setNotifications(notifications.filter(notification => notification.id !== notificationId));
    
    toast({
      title: 'Notification deleted',
      description: 'The notification has been deleted.',
    });
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    
    toast({
      title: 'All notifications marked as read',
      description: 'All notifications have been marked as read.',
    });
  };
  
  const handleClearAll = () => {
    setNotifications([]);
    
    toast({
      title: 'All notifications cleared',
      description: 'All notifications have been deleted.',
    });
  };
  
  // Filter notifications based on search and filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'read' && notification.read) ||
      (statusFilter === 'unread' && !notification.read);
      
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Get the number of unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const getNotificationTypeIcon = (type: NotificationTypeEnum) => {
    switch(type) {
      case 'info': 
        return <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />;
      case 'success': 
        return <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />;
      case 'warning': 
        return <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />;
      case 'error': 
        return <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />;
      default:
        return null;
    }
  };
  
  const getNotificationTypeBadge = (type: NotificationTypeEnum) => {
    switch(type) {
      case 'info': 
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Info</Badge>;
      case 'success': 
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Success</Badge>;
      case 'warning': 
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Warning</Badge>;
      case 'error': 
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Critical</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">{unreadCount} unread</Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={notifications.length === 0 || notifications.every(n => n.read)}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search notifications..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]" aria-label="Filter by type">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Critical</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]" aria-label="Filter by read status">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border ${notification.read ? 'bg-gray-50' : 'bg-white'} ${!notification.read ? 'border-gray-200' : 'border-gray-100'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {getNotificationTypeIcon(notification.type)}
                        <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </h3>
                      </div>
                      {getNotificationTypeBadge(notification.type)}
                    </div>
                    
                    <p className={`text-sm mb-3 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {format(notification.createdAt, 'MMM d, yyyy h:mm a')}
                      </span>
                      
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="h-8 px-2 text-xs"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Mark as Read
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(notification.id)}
                          className="h-8 px-2 text-xs text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Bell className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">No notifications</h3>
                <p className="mt-1 text-gray-500">You're all caught up!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SldcNotifications;
