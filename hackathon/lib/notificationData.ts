import { Notification } from '@/types/notification';

// Simple in-memory notifications storage
let notifications: Notification[] = [];

// Initialize with sample notifications
const initializeSampleNotifications = () => {
  notifications = [
    {
      id: '1',
      title: 'Welcome to KEC Campus!',
      message: 'Welcome all students to the new academic year. Stay updated with campus notifications.',
      department: 'All',
      year: 'All',
      hostel: 'All',
      timestamp: new Date().toISOString(),
      createdBy: 'admin@kec.edu',
    },
    {
      id: '2',
      title: 'CSE Department Meeting',
      message: 'All CSE students are requested to attend the department meeting on Friday at 3 PM.',
      department: 'CSE',
      year: 'All',
      hostel: 'All',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      createdBy: 'admin@kec.edu',
    },
    {
      id: '3',
      title: 'Hostel Mess Timing Change',
      message: 'Hostel mess timing will be changed from next week. Breakfast: 7-9 AM, Lunch: 12-2 PM, Dinner: 7-9 PM.',
      department: 'All',
      year: 'All',
      hostel: 'Hostel',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      createdBy: 'admin@kec.edu',
    },
    {
      id: '4',
      title: 'Third Year Project Guidelines',
      message: 'Third year students, please submit your project proposals by next Monday.',
      department: 'All',
      year: '3',
      hostel: 'All',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      createdBy: 'admin@kec.edu',
    },
  ];
};

// Initialize on first load
if (notifications.length === 0) {
  initializeSampleNotifications();
}

export function getAllNotifications(): Notification[] {
  return [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getFilteredNotifications(
  department: string,
  year: string,
  userType: 'hostel' | 'day_scholar'
): Notification[] {
  const hostelValue = userType === 'hostel' ? 'Hostel' : 'Day Scholar';
  
  return notifications.filter(notif => {
    const deptMatch = notif.department === 'All' || notif.department === department;
    const yearMatch = notif.year === 'All' || notif.year === year;
    const hostelMatch = notif.hostel === 'All' || notif.hostel === hostelValue;
    
    return deptMatch && yearMatch && hostelMatch;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function createNotification(notification: Omit<Notification, 'id' | 'timestamp'>): Notification {
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };
  notifications.push(newNotification);
  return newNotification;
}

export function deleteNotification(id: string): boolean {
  const index = notifications.findIndex(n => n.id === id);
  if (index === -1) return false;
  notifications.splice(index, 1);
  return true;
}
