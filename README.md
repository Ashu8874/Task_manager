# TeamFlow - Project Management Application

A full-stack project management application built with React, REST APIs, role-based access control, and a database-backed Node server.

## Features

- 🎯 **Dashboard** - Overview of tasks, projects, and team performance
- 📊 **Projects** - Create and manage multiple projects with team members
- ✅ **Tasks** - Kanban board and list views for task management
- 👥 **Team Management** - Admin panel for team oversight
- 🔐 **Authentication + RBAC** - Signup/login with Admin and Member access rules
- 🗄️ **REST API + Database** - PostgreSQL on Railway, with a local JSON document-store fallback
- 🤖 **AI Insights** - Get intelligent recommendations (requires API key)
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Node.js REST API** - Auth, projects, tasks, team, validation, and RBAC
- **PostgreSQL** - Production database via `DATABASE_URL` on Railway
- **CSS-in-JS** - Inline styles for component encapsulation

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the API server:

```bash
npm run dev:api
```

4. In another terminal, start the frontend:

```bash
npm run dev
```

5. Open the Vite URL in your browser. For a production-like local run, use `npm run build && npm start` and open [http://localhost:8080](http://localhost:8080).

## Available Scripts

- `npm run dev` - Start development server
- `npm run dev:api` - Start REST API server
- `npm start` - Serve the built app and API
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Demo Accounts

- **Admin**: alice@team.com / admin123
- **Member**: bob@team.com / member123

## Project Structure

```
teamflow/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── data/            # Mock data and constants
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── styles/          # Global styles
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── index.html           # HTML template
```

## Configuration

### AI Features (Optional)

To enable AI insights, you'll need to configure the Anthropic API:

1. Get an API key from [Anthropic](https://www.anthropic.com/)
2. Create a `.env` file:

```env
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

3. Update the API calls in the code to use the environment variable

## Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

## Railway Deployment

1. Push this repository to GitHub.
2. Create a new Railway project from the repo.
3. Add a Railway PostgreSQL database.
4. Set environment variables:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=replace-with-a-long-random-secret
NPM_CONFIG_CACHE=/tmp/.npm
```

Railway uses `railway.json` to run `npm install && npm run build`, then starts the app with `npm start`. The Node server serves both `/api/*` and the built React app.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
