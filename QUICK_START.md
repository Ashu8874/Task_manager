# TeamFlow - Quick Start Guide

Get up and running with TeamFlow in 5 minutes!

## 🚀 Installation

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 🎯 First Steps

### Login with Demo Account

Use one of these demo accounts:

**Admin Account:**
- Email: `alice@team.com`
- Password: `admin123`

**Member Account:**
- Email: `bob@team.com`
- Password: `member123`

### Or Create New Account

Click "Sign Up" and create your own account!

## 📋 Features Overview

### Dashboard
- View task statistics
- See recent tasks
- Monitor project progress
- Get AI-powered insights

### Projects
- Create new projects (Admin only)
- Assign team members
- Track project progress
- View project-specific tasks

### Tasks
- **Kanban View**: Drag-and-drop task management
- **List View**: Detailed task table
- Filter by project, priority, assignee
- Create, edit, and delete tasks
- Set due dates and priorities

### Team (Admin Only)
- View all team members
- See workload distribution
- Get AI workload analysis
- Monitor completion rates

## 🤖 AI Features (Optional)

To enable AI insights:

1. Get an API key from [Anthropic](https://www.anthropic.com/)
2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Add your API key:
   ```
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   ```
4. Restart the dev server

## 🎨 Customization

### Change Colors

Edit `src/data/constants.js`:

```javascript
export const PROJECT_COLORS = [
  '#6366f1',  // Indigo
  '#0ea5e9',  // Sky blue
  '#10b981',  // Green
  // Add your colors...
];
```

### Modify Mock Data

Edit `src/data/mockData.js` to change initial users, projects, and tasks.

## 📱 Responsive Design

TeamFlow works on:
- Desktop (1920px+)
- Laptop (1366px+)
- Tablet (768px+)
- Mobile (375px+)

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

## 💾 Data Persistence

All data is stored in browser's localStorage:
- Survives page refreshes
- Separate per browser/device
- Can be cleared via browser settings

## 🐛 Troubleshooting

### Port 3000 already in use?

Edit `vite.config.js`:

```javascript
server: {
  port: 3001,  // Change to any available port
}
```

### Styles not loading?

Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### AI features not working?

1. Check `.env` file exists
2. Verify API key is correct
3. Check browser console for errors
4. Ensure you have internet connection

## 📚 Learn More

- [Full Documentation](./README.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🆘 Need Help?

- Check the [README](./README.md) for detailed documentation
- Open an issue on GitHub
- Review the code comments

## 🎉 Next Steps

1. Explore the dashboard
2. Create a new project
3. Add some tasks
4. Try the AI insights
5. Customize the colors
6. Deploy to production!

Happy project managing! 🚀
