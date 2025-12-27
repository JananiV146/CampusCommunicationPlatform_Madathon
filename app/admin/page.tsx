'use client';

import { useState, useEffect } from 'react';
import { WeeklyMenu, DayMenu, MealType, MenuItem } from '@/types/menu';
import Link from 'next/link';

export default function AdminPage() {
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/menu');
      if (response.ok) {
        const data = await response.json();
        setWeeklyMenu(data);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      setMessage({ type: 'error', text: 'Failed to load menu data' });
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

  if (!weeklyMenu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load menu data</p>
        </div>
      </div>
    );
  }

  const currentDayMenu = weeklyMenu[selectedDay];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">⚙️ Admin Panel</h1>
              <p className="text-sm text-gray-600">Manage hostel menu</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              ← Back to Menu
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
                  {currentDayMenu[mealType].map((item, index) => (
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
                  {currentDayMenu[mealType].length === 0 && (
                    <p className="text-gray-400 italic text-sm">No items. Click + Add to add items.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
