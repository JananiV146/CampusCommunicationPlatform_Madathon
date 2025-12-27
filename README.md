# 🍽️ KEC Hostel Menu Checker

A modern web application for KEC hostel students to check their daily and weekly meal menus. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- **Today's Menu**: Quick view of today's breakfast, lunch, and dinner
- **Weekly Menu**: Browse menus for the entire week with easy day selection
- **Admin Panel**: Easy-to-use interface for updating menus
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Beautiful UI**: Modern, clean interface with intuitive navigation

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
│   ├── api/menu/          # API routes for menu data
│   ├── admin/             # Admin panel page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main homepage
├── components/
│   ├── MenuCard.tsx       # Component for displaying meal cards
│   ├── DayMenuView.tsx    # Component for single day menu
│   └── WeeklyMenuView.tsx # Component for weekly menu
├── lib/
│   └── menuData.ts        # Menu data management
└── types/
    └── menu.ts            # TypeScript type definitions
```

## 🎯 Usage

### For Students

1. Visit the homepage to see today's menu by default
2. Click "Weekly Menu" to browse menus for the entire week
3. Select any day from the weekly view to see detailed menu

### For Administrators

1. Navigate to the Admin Panel (link in header)
2. Select the day you want to edit
3. Add, edit, or remove menu items for breakfast, lunch, or dinner
4. Click "Save Changes" to update the menu

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Storage**: In-memory (can be easily migrated to a database)

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🔮 Future Enhancements

- Database integration (PostgreSQL, MongoDB, etc.)
- User authentication for admin panel
- Menu notifications/alerts
- Favorite meals tracking
- Menu history/archives
- Multiple hostel support
- Special dietary options filter

## 🤝 Contributing

This is a hackathon project. Feel free to suggest improvements or contribute!

## 📄 License

This project is created for KEC hackathon.

## 👨‍💻 Made With ❤️

Built for KEC students to make hostel life easier!

---

**Note**: Currently uses in-memory storage. For production deployment, consider integrating with a database like PostgreSQL, MongoDB, or Firebase.
