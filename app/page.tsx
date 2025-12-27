'use client';

import { useState, useEffect } from 'react';
import { DayMenu, WeeklyMenu } from '@/types/menu';
import DayMenuView from '@/components/DayMenuView';
import WeeklyMenuView from '@/components/WeeklyMenuView';
import Link from 'next/link';

export default function Home() {
  const [todayMenu, setTodayMenu] = useState<DayMenu | null>(null);
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'today' | 'weekly'>('today');

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
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
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🍽️ KEC Hostel Menu</h1>
              <p className="text-sm text-gray-600">Check your meal plans</p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* View Toggle */}
        <div className="mb-6 flex gap-4 bg-white p-2 rounded-lg shadow-sm inline-flex">
          <button
            onClick={() => setView('today')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              view === 'today'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Today's Menu
          </button>
          <button
            onClick={() => setView('weekly')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              view === 'weekly'
                ? 'bg-primary-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Weekly Menu
          </button>
        </div>

        {/* Menu Display */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {view === 'today' && todayMenu ? (
            <DayMenuView menu={todayMenu} />
          ) : view === 'weekly' && weeklyMenu ? (
            <WeeklyMenuView weeklyMenu={weeklyMenu} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No menu available</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 KEC Hostel Menu Checker | Made with ❤️ for KEC Students</p>
        </div>
      </footer>
    </div>
  );
}
