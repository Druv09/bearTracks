import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../utils/storage';
import { Notification } from '../types';

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = () => {
    if (!user) return;
    const userNotifications = getUserNotifications(user.id);
    setNotifications(userNotifications);
    setUnreadCount(userNotifications.filter(n => !n.read).length);
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    loadNotifications();
    setIsOpen(false);

    if (notification.itemId) {
      navigate(`/item/${notification.itemId}`);
    }
  };

  const handleMarkAllRead = () => {
    if (user) {
      markAllNotificationsAsRead(user.id);
      loadNotifications();
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-blue-800 rounded-lg transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/notifications');
                }}
                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                Notifications
              </button>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <CheckCheck size={14} />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-80">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 3 && (
              <div className="p-3 border-t border-gray-200 text-center">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/notifications');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
