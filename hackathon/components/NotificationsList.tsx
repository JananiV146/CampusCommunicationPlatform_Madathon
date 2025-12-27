import { Notification } from '@/types/notification';

interface NotificationsListProps {
  notifications: Notification[];
}

export default function NotificationsList({ notifications }: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No notifications available</p>
      </div>
    );
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white border-l-4 border-primary-600 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800">{notification.title}</h3>
            <span className="text-sm text-gray-500 ml-4">{formatDate(notification.timestamp)}</span>
          </div>
          <p className="text-gray-700">{notification.message}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {notification.department !== 'All' && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {notification.department}
              </span>
            )}
            {notification.year !== 'All' && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Year {notification.year}
              </span>
            )}
            {notification.hostel !== 'All' && (
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                {notification.hostel}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
