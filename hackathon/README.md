# 🎓 KEC Campus Portal - Personalized Smart Campus Utility

A comprehensive web application for KEC students featuring personalized hostel menu checking and smart campus notifications. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

### 🍽️ Hostel Menu Checker
- **Today's Menu**: Quick view of today's breakfast, lunch, and dinner (Hostel students only)
- **Weekly Menu**: Browse menus for the entire week with easy day selection
- **Admin Panel**: Easy-to-use interface for updating menus

### 📢 Personalized Campus Notifications
- **Smart Filtering**: Students only see notifications relevant to their department, year, and student type
- **Targeted Messaging**: Admins can send notifications to specific groups (department, year, hostel/day scholar)
- **Real-time Updates**: Notifications appear immediately after admin creates them

### 🔐 User Authentication & Profiles
- **Simple Login System**: Email and password authentication
- **User Profiles**: Stores department, year, and student type (Hostel/Day Scholar)
- **Role-based Access**: 
  - Hostel students see menu + notifications
  - Day scholars see only notifications
  - Admin users can manage everything

### 👨‍💼 Admin Features
- **Menu Management**: Update daily menus for the week
- **Notification Creator**: Create targeted notifications with filters
- **Notification Management**: View and delete existing notifications

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── login/         # Login API
│   │   │   └── register/      # Registration API
│   │   ├── menu/              # Menu data API
│   │   └── notifications/     # Notifications API
│   ├── admin/                 # Admin panel page
│   ├── login/                 # Login/Registration page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main homepage
├── components/
│   ├── MenuCard.tsx           # Component for displaying meal cards
│   ├── DayMenuView.tsx        # Component for single day menu
│   ├── WeeklyMenuView.tsx     # Component for weekly menu
│   └── NotificationsList.tsx  # Component for displaying notifications
├── lib/
│   ├── menuData.ts            # Menu data management
│   ├── userData.ts            # User data management
│   └── notificationData.ts    # Notification data management
└── types/
    ├── menu.ts                # Menu type definitions
    ├── user.ts                # User type definitions
    └── notification.ts        # Notification type definitions
```

## 🎯 Usage

### For Students

1. **Login/Register**: Visit the homepage and you'll be redirected to login
   - Use demo accounts or create a new account
   - On registration, provide: Email, Password, Department, Year, Student Type

2. **View Notifications**: 
   - See personalized notifications based on your profile
   - Notifications are filtered by department, year, and student type

3. **View Menu** (Hostel Students Only):
   - Toggle between "Today's Menu" and "Weekly Menu"
   - Browse meals for different days

### For Administrators

1. **Login**: Use admin credentials (admin@kec.edu / admin123)

2. **Manage Menu**:
   - Navigate to Admin Panel → Manage Menu tab
   - Select a day to edit
   - Add, edit, or remove menu items
   - Save changes

3. **Manage Notifications**:
   - Navigate to Admin Panel → Manage Notifications tab
   - Create new notifications with filters (Department, Year, Student Type)
   - Delete existing notifications

## 🔑 Demo Accounts

### Students
- **Hostel Student**: student@kec.edu / password123
- **Day Scholar**: dayscholar@kec.edu / password123

### Admin
- **Admin**: admin@kec.edu / admin123

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Storage**: In-memory (ready for database migration)

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🔮 Notification Filtering Logic

Notifications are shown to students based on the following logic:

A notification is visible if **ALL** of these match:
- `notification.department` === `student.department` OR `"All"`
- `notification.year` === `student.year` OR `"All"`
- `notification.hostel` === `student.userType` (converted: "Hostel" or "Day Scholar") OR `"All"`

## 🎨 Key Features Explained

### 1. Personalized Notifications
- Admins create notifications with target filters
- System automatically shows only relevant notifications to each student
- Supports targeting specific departments, years, or student types

### 2. Menu Visibility Control
- Hostel students see both menu and notifications
- Day scholars only see notifications
- Menu section is completely hidden for day scholars

### 3. Admin Panel
- Protected by admin email check (admin@kec.edu)
- Two tabs: Menu Management and Notification Management
- Full CRUD operations for both menus and notifications

## 🤝 Contributing

This is a hackathon project. Feel free to suggest improvements or contribute!

## 📄 License

This project is created for KEC hackathon.

## 👨‍💻 Made With ❤️

Built for KEC students to make campus life easier!

---

**Note**: Currently uses in-memory storage. For production deployment, consider integrating with a database like PostgreSQL, MongoDB, or Firebase.