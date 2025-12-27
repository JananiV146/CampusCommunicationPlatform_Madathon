import { NextRequest, NextResponse } from 'next/server';
import { getWeeklyMenu, getTodayMenu, updateDayMenu, getDayMenu } from '@/lib/menuData';
import { DayMenu } from '@/types/menu';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const day = searchParams.get('day');
  const today = searchParams.get('today');

  if (today === 'true') {
    const menu = getTodayMenu();
    if (!menu) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
    }
    return NextResponse.json(menu);
  }

  if (day) {
    const menu = getDayMenu(day);
    if (!menu) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
    }
    return NextResponse.json(menu);
  }

  const weeklyMenu = getWeeklyMenu();
  return NextResponse.json(weeklyMenu);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { day, menu } = body;

    if (!day || !menu) {
      return NextResponse.json({ error: 'Day and menu are required' }, { status: 400 });
    }

    updateDayMenu(day, menu as DayMenu);
    return NextResponse.json({ success: true, menu });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
