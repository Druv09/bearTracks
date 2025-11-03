import { User, FoundItem, ClaimRequest, Notification } from '../types';

// User management
export const getUsers = (): User[] => {
  const users = localStorage.getItem('bearTracks_users');
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem('bearTracks_users', JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const userId = localStorage.getItem('bearTracks_currentUser');
  if (!userId) return null;
  
  const users = getUsers();
  return users.find(user => user.id === userId) || null;
};

export const setCurrentUser = (userId: string): void => {
  localStorage.setItem('bearTracks_currentUser', userId);
};

export const logout = (): void => {
  localStorage.removeItem('bearTracks_currentUser');
};

// Items management
export const getItems = (): FoundItem[] => {
  const items = localStorage.getItem('bearTracks_items');
  return items ? JSON.parse(items) : [];
};

export const saveItems = (items: FoundItem[]): void => {
  localStorage.setItem('bearTracks_items', JSON.stringify(items));
};

// Claims management
export const getClaims = (): ClaimRequest[] => {
  const claims = localStorage.getItem('bearTracks_claims');
  return claims ? JSON.parse(claims) : [];
};

export const saveClaims = (claims: ClaimRequest[]): void => {
  localStorage.setItem('bearTracks_claims', JSON.stringify(claims));
};

// Notifications management
export const getNotifications = (): Notification[] => {
  const notifications = localStorage.getItem('bearTracks_notifications');
  return notifications ? JSON.parse(notifications) : [];
};

export const saveNotifications = (notifications: Notification[]): void => {
  localStorage.setItem('bearTracks_notifications', JSON.stringify(notifications));
};

export const getUserNotifications = (userId: string): Notification[] => {
  const notifications = getNotifications();
  return notifications.filter(n => n.userId === userId).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = getNotifications();
  const updated = notifications.map(n =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  saveNotifications(updated);
};

export const markAllNotificationsAsRead = (userId: string): void => {
  const notifications = getNotifications();
  const updated = notifications.map(n =>
    n.userId === userId ? { ...n, read: true } : n
  );
  saveNotifications(updated);
};

export const createNotification = (notification: Notification): void => {
  const notifications = getNotifications();
  saveNotifications([...notifications, notification]);
};

// Initialize with some demo data
export const initializeDemoData = (): void => {
  const existingUsers = getUsers();
  if (existingUsers.length === 0) {
    const demoUsers: User[] = [
      {
        id: 'admin-1',
        email: 'admin@bridgelandhs.edu',
        password: 'admin123',
        name: 'Admin User',
        gradeLevel: 'Staff',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'admin-2',
        email: 'druvanbharath@gmail.com',
        password: 'Dushy@2009',
        name: 'Druvan Bharath',
        gradeLevel: 'Staff',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'demo-student',
        email: 'student@bridgelandhs.edu',
        password: 'student123',
        name: 'Demo Student',
        gradeLevel: '11th Grade',
        role: 'student',
        createdAt: new Date().toISOString(),
      }
    ];
    saveUsers(demoUsers);
  }
};