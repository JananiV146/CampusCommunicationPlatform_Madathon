'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WeeklyMenu, DayMenu, MealType } from '@/types/menu';
import { Notification } from '@/types/notification';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'menu' | 'notifications'>('menu');

  // Notification form state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifDepartment, setNotifDepartment] = useState('All');
  const [notifYear, setNotifYear] = useState('All');
  const [notifHostel, setNotifHostel] = useState('All');

  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels: { [key: string]: string } = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };

  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];
  const mealLabels: { [key: string]: string } = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && user.email === 'admin@kec.edu') {
      fetchData();
    }
  }, [user]);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email === 'admin@kec.edu') {
          setUser(parsedUser);
        } else {
          router.push('/');
        }
      } else {
        router.push('/login');
      }
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [menuResponse, notifResponse] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/notifications'),
      ]);

      if (menuResponse.ok) {
        const data = await menuResponse.json();
        setWeeklyMenu(data);
      }

      if (notifResponse.ok) {
        const data = await notifResponse.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const updateMenuItem = (day: string, mealType: MealType, index: number, value: string) => {
    if (!weeklyMenu) return;

    const updatedMenu = { ...weeklyMenu };
    const dayMenu = { ...updatedMenu[day] };
    const items = [...dayMenu[mealType]];
    items[index] = { ...items[index], name: value };
    dayMenu[mealType] = items;
    updatedMenu[day] = dayMenu;

    setWeeklyMenu(updatedMenu);
  };

  const addMenuItem = (day: string, mealType: MealType) => {
    if (!weeklyMenu) return;

    const updatedMenu = { ...weeklyMenu };
    const dayMenu = { ...updatedMenu[day] };
    const items = [...dayMenu[mealType]];
    items.push({ id: `${day}-${mealType}-${Date.now()}`, name: '' });
    dayMenu[mealType] = items;
    updatedMenu[day] = dayMenu;

    setWeeklyMenu(updatedMenu);
  };

  const removeMenuItem = (day: string, mealType: MealType, index: number) => {
    if (!weeklyMenu) return;

    const updatedMenu = { ...weeklyMenu };
    const dayMenu = { ...updatedMenu[day] };
    const items = [...dayMenu[mealType]];
    items.splice(index, 1);
    dayMenu[mealType] = items;
    updatedMenu[day] = dayMenu;

    setWeeklyMenu(updatedMenu);
  };

  const saveMenu = async () => {
    if (!weeklyMenu || !selectedDay) return;

    try {
      setSaving(true);
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          day: selectedDay,
          menu: weeklyMenu[selectedDay],
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Menu updated successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to update menu' });
      }
    } catch (error) {
      console.error('Error saving menu:', error);
      setMessage({ type: 'error', text: 'Error saving menu' });
    } finally {
      setSaving(false);
    }
  };

  const createNotification = async () => {
    if (!notifTitle || !notifMessage) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: notifTitle,
          message: notifMessage,
          department: notifDepartment,
          year: notifYear,
          hostel: notifHostel,
          createdBy: user?.email,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Notification created successfully!' });
        setNotifTitle('');
        setNotifMessage('');
        setNotifDepartment('All');
        setNotifYear('All');
        setNotifHostel('All');
        setTimeout(() => {
          setMessage(null);
          fetchData();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: 'Failed to create notification' });
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      setMessage({ type: 'error', text: 'Error creating notification' });
    } finally {
      setSaving(false);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Notification deleted successfully!' });
        setTimeout(() => {
          setMessage(null);
          fetchData();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: 'Failed to delete notification' });
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      setMessage({ type: 'error', text: 'Error deleting notification' });
    }
  };

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

  if (!user || user.email !== 'admin@kec.edu') {
    return null;
  }

  const currentDayMenu = weeklyMenu?.[selectedDay];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">⚙️ Admin Panel</h1>
              <p className="text-sm text-gray-600">Manage menu and notifications</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              ← Back to Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tab Selection */}
        <div className="mb-6 flex gap-4 bg-white p-2 rounded-lg shadow-sm inline-flex">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'menu'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🍽️ Manage Menu
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'notifications'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📢 Manage Notifications
          </button>
        </div>

        {/* Menu Management Tab */}
        {activeTab === 'menu' && weeklyMenu && (
          <>
            {/* Day Selection */}
            <div className="mb-6 bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold mb-4">Select Day</h2>
              <div className="flex flex-wrap gap-2">
                {dayOrder.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedDay === day
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {dayLabels[day]}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Editor */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Editing: {dayLabels[selectedDay]}
                </h2>
                <button
                  onClick={saveMenu}
                  disabled={saving}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {mealTypes.map((mealType) => (
                  <div key={mealType} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800 capitalize">
                        {mealLabels[mealType]}
                      </h3>
                      <button
                        onClick={() => addMenuItem(selectedDay, mealType)}
                        className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {currentDayMenu?.[mealType].map((item, index) => (
                        <div key={item.id} className="flex gap-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateMenuItem(selectedDay, mealType, index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Menu item name"
                          />
                          <button
                            onClick={() => removeMenuItem(selectedDay, mealType, index)}
                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {currentDayMenu?.[mealType].length === 0 && (
                        <p className="text-gray-400 italic text-sm">No items. Click + Add to add items.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Notification Management Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* Create Notification Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Notification</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Notification title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Notification message"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      value={notifDepartment}
                      onChange={(e) => setNotifDepartment(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="All">All</option>
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="MECH">MECH</option>
                      <option value="CIVIL">CIVIL</option>
                      <option value="IT">IT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <select
                      value={notifYear}
                      onChange={(e) => setNotifYear(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="All">All</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Type
                    </label>
                    <select
                      value={notifHostel}
                      onChange={(e) => setNotifHostel(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="All">All</option>
                      <option value="Hostel">Hostel</option>
                      <option value="Day Scholar">Day Scholar</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={createNotification}
                  disabled={saving}
                  className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Creating...' : '📢 Create Notification'}
                </button>
              </div>
            </div>

            {/* Existing Notifications */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Existing Notifications</h2>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No notifications yet</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{notif.title}</h3>
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-gray-700 mb-2">{notif.message}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Dept: {notif.department}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          Year: {notif.year}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {notif.hostel}
                        </span>
                        <span className="text-gray-500">
                          {new Date(notif.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}