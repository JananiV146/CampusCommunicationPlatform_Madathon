import { NextRequest, NextResponse } from 'next/server';
import { getAllNotifications, createNotification, getFilteredNotifications } from '@/lib/notificationData';
import { Notification } from '@/types/notification';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const department = searchParams.get('department');
  const year = searchParams.get('year');
  const userType = searchParams.get('userType') as 'hostel' | 'day_scholar' | null;

  // If filters are provided, return filtered notifications
  if (department && year && userType) {
    const filtered = getFilteredNotifications(department, year, userType);
    return NextResponse.json(filtered);
  }

  // Otherwise return all (for admin)
  const allNotifications = getAllNotifications();
  return NextResponse.json(allNotifications);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, department, year, hostel, createdBy } = body;

    if (!title || !message || !department || !year || !hostel) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const notification = createNotification({
      title,
      message,
      department,
      year,
      hostel,
      createdBy: createdBy || 'admin@kec.edu',
    });

    return NextResponse.json({ success: true, notification }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    const { deleteNotification } = await import('@/lib/notificationData');
    const success = deleteNotification(id);

    if (!success) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
