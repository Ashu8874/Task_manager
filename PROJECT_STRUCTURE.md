# TeamFlow - Project Structure

## Overview
This document describes the production-ready folder structure and organization of the TeamFlow project.

## Directory Structure

```
teamflow/
├── .vscode/                    # VS Code configuration
│   └── extensions.json         # Recommended extensions
├── public/                     # Static assets
│   └── vite.svg               # Favicon
├── src/                       # Source code
│   ├── components/            # Reusable UI components
│   │   ├── AIInsight.jsx     # AI insight display component
│   │   ├── Avatar.jsx        # User avatar component
│   │   ├── Badge.jsx         # Status/priority badge component
│   │   ├── Button.jsx        # Reusable button component
│   │   ├── Input.jsx         # Form input component
│   │   ├── Modal.jsx         # Modal dialog component
│   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   ├── StatCard.jsx      # Dashboard statistics card
│   │   ├── TaskCard.jsx      # Task display card
│   │   └── TaskFormModal.jsx # Task creation/edit modal
│   ├── data/                  # Data and constants
│   │   ├── constants.js      # App-wide constants
│   │   └── mockData.js       # Initial mock data
│   ├── hooks/                 # Custom React hooks
│   │   └── useLocalStorage.js # LocalStorage persistence hook
│   ├── pages/                 # Page components
│   │   ├── AuthPage.jsx      # Login/signup page
│   │   ├── Dashboard.jsx     # Main dashboard
│   │   ├── ProjectDetailPage.jsx # Individual project view
│   │   ├── ProjectsPage.jsx  # Projects list
│   │   ├── TasksPage.jsx     # Tasks kanban/list view
│   │   └── TeamPage.jsx      # Team management (Admin)
│   ├── styles/                # Global styles
│   │   └── global.css        # Global CSS and animations
│   ├── utils/                 # Utility functions
│   │   ├── aiService.js      # AI/API integration
│   │   ├── dateUtils.js      # Date formatting utilities
│   │   └── userUtils.js      # User-related utilities
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Application entry point
├── .env.example               # Environment variables template
├── .eslintrc.cjs              # ESLint configuration
├── .gitignore                 # Git ignore rules
├── .prettierignore            # Prettier ignore rules
├── .prettierrc                # Prettier configuration
├── CONTRIBUTING.md            # Contribution guidelines
├── LICENSE                    # MIT License
├── PROJECT_STRUCTURE.md       # This file
├── README.md                  # Project documentation
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
└── vite.config.js             # Vite configuration
```

## Key Design Decisions

### Component Organization
- **components/**: Reusable, presentational components
- **pages/**: Route-level components with business logic
- **Separation of concerns**: UI components are separate from page logic

### Data Management
- **LocalStorage**: Persistent data storage using custom hook
- **Mock Data**: Initial data for demo purposes
- **Constants**: Centralized configuration for colors, statuses, priorities

### Utilities
- **aiService.js**: Centralized AI API calls
- **dateUtils.js**: Date formatting and calculations
- **userUtils.js**: User-related helper functions

### Styling Approach
- **CSS-in-JS**: Inline styles for component encapsulation
- **Global CSS**: Fonts, animations, and base styles
- **No CSS framework**: Custom styling for full control

## Best Practices Implemented

1. **Component Reusability**: Small, focused components
2. **Custom Hooks**: useLocalStorage for data persistence
3. **Prop Drilling Minimization**: Strategic component composition
4. **Code Splitting**: Separate page components
5. **Utility Functions**: DRY principle for common operations
6. **Environment Variables**: Secure API key management
7. **Linting & Formatting**: ESLint and Prettier configured
8. **Git Workflow**: Proper .gitignore and contribution guidelines

## Production Optimizations

1. **Vite Build Tool**: Fast HMR and optimized builds
2. **Code Splitting**: Vendor chunk separation
3. **Source Maps**: Enabled for debugging
4. **Tree Shaking**: Automatic dead code elimination
5. **Asset Optimization**: Vite handles asset optimization

## Development Workflow

1. **Install**: `npm install`
2. **Develop**: `npm run dev`
3. **Lint**: `npm run lint`
4. **Format**: `npm run format`
5. **Build**: `npm run build`
6. **Preview**: `npm run preview`

## Future Enhancements

- Add React Router for proper routing
- Implement state management (Context API or Zustand)
- Add unit tests (Vitest)
- Add E2E tests (Playwright)
- Implement real backend API
- Add TypeScript for type safety
- Add drag-and-drop for kanban board
- Implement real-time collaboration
- Add file attachments to tasks
- Implement notifications system
