
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types';

interface NotificationsState {
  items: Notification[];
  unread: number;
}

const initialState: NotificationsState = {
  items: [
    {
      id: '1',
      title: 'Schedule Received',
      message: 'Your schedule has been received by SLDC.',
      type: 'success',
      read: false,
      createdAt: new Date()
    },
    {
      id: '2',
      title: 'Report Verification',
      message: 'SLDC has verified your recent report with comments.',
      type: 'info',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'Demand Spike Alert',
      message: 'Unusual demand spike detected in your area.',
      type: 'warning',
      read: false,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
    }
  ],
  unread: 3,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload);
      state.unread += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(item => item.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unread -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach(item => {
        item.read = true;
      });
      state.unread = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        const wasUnread = !state.items[index].read;
        state.items.splice(index, 1);
        if (wasUnread) {
          state.unread -= 1;
        }
      }
    },
    clearAllNotifications: (state) => {
      state.items = [];
      state.unread = 0;
    }
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
