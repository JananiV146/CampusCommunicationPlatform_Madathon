import { DayMenu, WeeklyMenu } from '@/types/menu';

// Simple file-based storage (in production, use a database)
let menuData: WeeklyMenu = {};

// Initialize with sample data
const initializeSampleData = () => {
  const days: Array<{ day: string; items: { breakfast: string[]; lunch: string[]; dinner: string[] } }> = [
    {
      day: 'monday',
      items: {
        breakfast: ['Idli & Sambar', 'Dosa', 'Chutney'],
        lunch: ['Rice', 'Dal', 'Mixed Vegetables', 'Pickle'],
        dinner: ['Chapati', 'Paneer Curry', 'Dal', 'Salad']
      }
    },
    {
      day: 'tuesday',
      items: {
        breakfast: ['Poha', 'Tea', 'Banana'],
        lunch: ['Rice', 'Sambar', 'Brinjal Curry', 'Rasam', 'Curd'],
        dinner: ['Fried Rice', 'Manchurian', 'Soup']
      }
    },
    {
      day: 'wednesday',
      items: {
        breakfast: ['Paratha', 'Curd', 'Pickle'],
        lunch: ['Biryani', 'Raita', 'Chicken Curry', 'Salad'],
        dinner: ['Chapati', 'Dal Fry', 'Aloo Gobi', 'Salad']
      }
    },
    {
      day: 'thursday',
      items: {
        breakfast: ['Upma', 'Sambar', 'Coconut Chutney'],
        lunch: ['Rice', 'Rajma', 'Jeera Aloo', 'Pickle'],
        dinner: ['Noodles', 'Veg Manchurian', 'Soup']
      }
    },
    {
      day: 'friday',
      items: {
        breakfast: ['Bread & Jam', 'Boiled Eggs', 'Tea'],
        lunch: ['Rice', 'Dal Tadka', 'Mix Veg', 'Curd'],
        dinner: ['Chapati', 'Chole', 'Bhature', 'Salad']
      }
    },
    {
      day: 'saturday',
      items: {
        breakfast: ['Dosa', 'Sambar', 'Coconut Chutney'],
        lunch: ['Rice', 'Dal', 'Baingan Bharta', 'Rasam'],
        dinner: ['Paratha', 'Paneer Butter Masala', 'Dal', 'Salad']
      }
    },
    {
      day: 'sunday',
      items: {
        breakfast: ['Puri', 'Aloo Sabzi', 'Halwa'],
        lunch: ['Rice', 'Sambar', 'Avial', 'Papad', 'Payasam'],
        dinner: ['Chapati', 'Dal Makhani', 'Veg Kofta', 'Salad']
      }
    }
  ];

  menuData = {};
  days.forEach(({ day, items }) => {
    menuData[day] = {
      day: day as any,
      breakfast: items.breakfast.map((name, idx) => ({ id: `${day}-breakfast-${idx}`, name })),
      lunch: items.lunch.map((name, idx) => ({ id: `${day}-lunch-${idx}`, name })),
      dinner: items.dinner.map((name, idx) => ({ id: `${day}-dinner-${idx}`, name })),
    };
  });
};

// Initialize on first load
if (Object.keys(menuData).length === 0) {
  initializeSampleData();
}

export function getWeeklyMenu(): WeeklyMenu {
  return menuData;
}

export function getDayMenu(day: string): DayMenu | null {
  return menuData[day.toLowerCase()] || null;
}

export function updateDayMenu(day: string, menu: DayMenu): void {
  menuData[day.toLowerCase()] = menu;
}

export function getTodayMenu(): DayMenu | null {
  const today = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayName = dayNames[today.getDay()];
  return getDayMenu(todayName);
}
