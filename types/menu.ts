export type MealType = 'breakfast' | 'lunch' | 'dinner';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
}

export interface DayMenu {
  day: DayOfWeek;
  date?: string;
  breakfast: MenuItem[];
  lunch: MenuItem[];
  dinner: MenuItem[];
}

export interface WeeklyMenu {
  [key: string]: DayMenu;
}
