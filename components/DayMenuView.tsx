import { DayMenu } from '@/types/menu';
import MenuCard from './MenuCard';

interface DayMenuViewProps {
  menu: DayMenu;
  date?: string;
}

export default function DayMenuView({ menu, date }: DayMenuViewProps) {
  const dayLabels: { [key: string]: string } = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 capitalize mb-2">
          {dayLabels[menu.day] || menu.day}
        </h2>
        {date && (
          <p className="text-gray-600">{new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <MenuCard mealType="breakfast" items={menu.breakfast} />
        <MenuCard mealType="lunch" items={menu.lunch} />
        <MenuCard mealType="dinner" items={menu.dinner} />
      </div>
    </div>
  );
}
