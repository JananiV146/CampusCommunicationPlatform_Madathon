import { User } from '@/types/user';

// Simple in-memory user storage
let users: User[] = [];

// Initialize with sample users
const initializeSampleUsers = () => {
  users = [
    {
      id: '1',
      email: 'student@kec.edu',
      password: 'password123', // In production, hash this
      department: 'CSE',
      year: '3',
      userType: 'hostel',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'dayscholar@kec.edu',
      password: 'password123',
      department: 'ECE',
      year: '2',
      userType: 'day_scholar',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      email: 'admin@kec.edu',
      password: 'admin123',
      department: 'Admin',
      year: 'All',
      userType: 'hostel',
      createdAt: new Date().toISOString(),
    },
  ];
};

// Initialize on first load
if (users.length === 0) {
  initializeSampleUsers();
}

export function getUserByEmail(email: string): User | null {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getUserById(id: string): User | null {
  return users.find(u => u.id === id) || null;
}

export function createUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
}

export function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>): User | null {
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) return null;
  
  users[userIndex] = { ...users[userIndex], ...updates };
  return users[userIndex];
}

export function getAllUsers(): User[] {
  return users;
}
