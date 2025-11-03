import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, getNotifications, saveNotifications } from '../utils/storage';
import { Notification } from '../types';

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = () => {
    if (!user) return;
    const userNotifications = getUserNotifications(user.id);
    setNotifications(userNotifications);
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkAllRead = () => {
    if (user) {
      markAllNotificationsAsRead(user.id);
      loadNotifications();
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    loadNotifications();

    if (notification.itemId) {
      navigate(`/item/${notification.itemId}`);
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    const allNotifications = getNotifications();
    const updated = allNotifications.filter(n => n.id !== notificationId);
    saveNotifications(updated);
    loadNotifications();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view notifications.</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-orange-300 mb-4 flex items-center space-x-2 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-4 mb-4">
            <Bell size={32} />
            <h1 className="text-3xl md:text-4xl font-bold">Notifications</h1>
          </div>
          <p className="text-blue-100 text-lg">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notifications.length > 0 && unreadCount > 0 && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleMarkAllRead}
              className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <CheckCheck size={16} />
              <span>Mark All as Read</span>
            </button>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Bell size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600">You don't have any notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all ${
                  !notification.read ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      onClick={() => handleNotificationClick(notification)}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{notification.message}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                      title="Delete notification"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {notification.itemId && !notification.read && (
                    <button
                      onClick={() => handleNotificationClick(notification)}
                      className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Item
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
