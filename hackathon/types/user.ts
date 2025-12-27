export type UserType = 'hostel' | 'day_scholar';

export interface User {
  id: string;
  email: string;
  password: string; // In production, this should be hashed
  department: string;
  year: string;
  userType: UserType;
  createdAt: string;
}

export interface UserSession {
  user: Omit<User, 'password'>;
}
