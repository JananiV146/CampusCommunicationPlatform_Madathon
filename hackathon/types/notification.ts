export type NotificationTarget = 'All' | string;

export interface Notification {
  id: string;
  title: string;
  message: string;
  department: NotificationTarget;
  year: NotificationTarget;
  hostel: NotificationTarget; // 'Hostel', 'Day Scholar', or 'All'
  timestamp: string;
  createdBy?: string;
}
