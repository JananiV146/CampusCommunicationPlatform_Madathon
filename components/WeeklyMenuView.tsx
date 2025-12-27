'use client';

import { useState, useEffect } from 'react';
import { WeeklyMenu, DayMenu } from '@/types/menu';
import DayMenuView from './DayMenuView';

interface WeeklyMenuViewProps {
  weeklyMenu: WeeklyMenu;
}

export default function WeeklyMenuView({ weeklyMenu }: WeeklyMenuViewProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels: { [key: string]: string } = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  };

  // Set today as default selected day
  useEffect(() => {
    const today = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayName = dayNames[today.getDay()];
    setSelectedDay(todayName);
  }, []);

  const getDayDate = (day: string) => {
    const today = new Date();
    const dayIndex = dayOrder.indexOf(day);
    const currentDayIndex = today.getDay() === 0 ? 7 : today.getDay();
    const diff = dayIndex - (currentDayIndex - 1);
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    return targetDate.toISOString().split('T')[0];
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Weekly Menu</h2>
        <div className="flex flex-wrap gap-2">
          {dayOrder.map((day) => {
            const menu = weeklyMenu[day];
            if (!menu) return null;
            const isToday = day === selectedDay;
            const isCurrentDay = (() => {
              const today = new Date();
              const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
              return dayNames[today.getDay()] === day;
            })();

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  isToday
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                } ${isCurrentDay && !isToday ? 'ring-2 ring-primary-400' : ''}`}
              >
                {dayLabels[day]}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDay && weeklyMenu[selectedDay] && (
        <DayMenuView menu={weeklyMenu[selectedDay]} date={getDayDate(selectedDay)} />
      )}
    </div>
  );
}
