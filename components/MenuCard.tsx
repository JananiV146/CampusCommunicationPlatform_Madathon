import { MenuItem, MealType } from '@/types/menu';

interface MenuCardProps {
  mealType: MealType;
  items: MenuItem[];
}

export default function MenuCard({ mealType, items }: MenuCardProps) {
  const mealColors = {
    breakfast: 'bg-amber-50 border-amber-200',
    lunch: 'bg-blue-50 border-blue-200',
    dinner: 'bg-purple-50 border-purple-200',
  };

  const mealIcons = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
  };

  const mealLabels = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${mealColors[mealType]}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{mealIcons[mealType]}</span>
        <h3 className="text-xl font-bold text-gray-800 capitalize">
          {mealLabels[mealType]}
        </h3>
      </div>
      <ul className="space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-2 text-gray-700"
            >
              <span className="text-green-500 mt-1">•</span>
              <span className="flex-1">{item.name}</span>
            </li>
          ))
        ) : (
          <li className="text-gray-500 italic">No items available</li>
        )}
      </ul>
    </div>
  );
}
