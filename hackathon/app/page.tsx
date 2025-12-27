'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DayMenu, WeeklyMenu } from '@/types/menu';
import { Notification } from '@/types/notification';
import { User } from '@/types/user';
import DayMenuView from '@/components/DayMenuView';
import WeeklyMenuView from '@/components/WeeklyMenuView';
import NotificationsList from '@/components/NotificationsList';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [todayMenu, setTodayMenu] = useState<DayMenu | null>(null);
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'menu' | 'notifications'>('notifications');
  const [menuView, setMenuView] = useState<'today' | 'weekly'>('today');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        router.push('/login');
      }
    }
  };

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch notifications
      const notifResponse = await fetch(
        `/api/notifications?department=${user.department}&year=${user.year}&userType=${user.userType}`
      );
      if (notifResponse.ok) {
        const notifs = await notifResponse.json();
        setNotifications(notifs);
      }

      // Only fetch menu if user is hostel student
      if (user.userType === 'hostel') {
        const [todayResponse, weeklyResponse] = await Promise.all([
          fetch('/api/menu?today=true'),
          fetch('/api/menu'),
        ]);

        if (todayResponse.ok) {
          const today = await todayResponse.json();
          setTodayMenu(today);
        }

        if (weeklyResponse.ok) {
          const weekly = await weeklyResponse.json();
          setWeeklyMenu(weekly);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isAdmin = user?.email === 'admin@kec.edu';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isHostelStudent = user.userType === 'hostel';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🎓 KEC Campus Portal</h1>
              <p className="text-sm text-gray-600">
                {user.department} • Year {user.year} • {user.userType === 'hostel' ? 'Hostel' : 'Day Scholar'}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* View Toggle */}
        <div className="mb-6 flex gap-4 bg-white p-2 rounded-lg shadow-sm inline-flex">
          <button
            onClick={() => setView('notifications')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              view === 'notifications'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📢 Campus Notifications
          </button>
          {isHostelStudent && (
            <button
              onClick={() => setView('menu')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                view === 'menu'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
            }`}
            >
              🍽️ Hostel Menu
            </button>
          )}
        </div>

        {/* Notifications View */}
        {view === 'notifications' && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Campus Notifications</h2>
            <NotificationsList notifications={notifications} />
          </div>
        )}

        {/* Menu View (Only for Hostel Students) */}
        {view === 'menu' && isHostelStudent && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="mb-6 flex gap-4 bg-gray-50 p-2 rounded-lg shadow-sm inline-flex">
              <button
                onClick={() => setMenuView('today')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  menuView === 'today'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Today's Menu
              </button>
              <button
                onClick={() => setMenuView('weekly')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  menuView === 'weekly'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Weekly Menu
              </button>
            </div>

            {menuView === 'today' && todayMenu ? (
              <DayMenuView menu={todayMenu} />
            ) : menuView === 'weekly' && weeklyMenu ? (
              <WeeklyMenuView weeklyMenu={weeklyMenu} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No menu available</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 KEC Campus Portal | Made with ❤️ for KEC Students</p>
        </div>
      </footer>
    </div>
  );
}