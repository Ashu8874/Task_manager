# TeamFlow - Railway Deployment Guide

## Prerequisites

- Node.js 16+ installed
- npm, yarn, or pnpm package manager
- Git for version control
- A Railway account

## Local Production Check

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

For local development without `DATABASE_URL`, the API uses `server/data/db.json` as a small document database. For PostgreSQL, create `.env` or export:

```env
DATABASE_URL=postgresql://user:password@host:5432/db
JWT_SECRET=change-this-long-random-secret
NPM_CONFIG_CACHE=/tmp/.npm
```

### 3. Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### 4. Start the full-stack server locally

```bash
npm start
```

Open [http://localhost:8080](http://localhost:8080).

## Deploy on Railway

1. Push the repository to GitHub.
2. In Railway, create a new project from the GitHub repo.
3. Add the PostgreSQL plugin/service.
4. In the web service variables, add:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=replace-with-a-long-random-secret
NPM_CONFIG_CACHE=/tmp/.npm
```

5. Deploy. `railway.json` configures:

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Healthcheck: `/api/health`

The server creates the required tables and seeds demo users/projects/tasks on first boot.

## Post-Deployment Checklist

- [ ] Test all pages and features
- [ ] Verify `/api/health` returns `{ "ok": true }`
- [ ] Verify authentication works
- [ ] Check that projects and tasks persist in PostgreSQL
- [ ] Test AI features (if API key configured)
- [ ] Verify responsive design on mobile
- [ ] Check browser console for errors
- [ ] Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Verify HTTPS is working
- [ ] Check page load performance
- [ ] Test all CRUD operations (Create, Read, Update, Delete)

## API Summary

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/me`
- `GET /api/users`
- `POST /api/projects` Admin only
- `DELETE /api/projects/:id` Admin only
- `POST /api/tasks` Admins or project members
- `PUT /api/tasks/:id` Admins or assigned member
- `DELETE /api/tasks/:id` Admin only

### CDN Configuration

For better global performance:
- Use CloudFront (AWS)
- Use Cloudflare
- Use Vercel Edge Network (automatic)
- Use Netlify Edge (automatic)

### Caching Headers

Configure your server to set proper cache headers:

```
Cache-Control: public, max-age=31536000, immutable  # For assets
Cache-Control: no-cache  # For index.html
```

## Monitoring

### Recommended Tools:

- **Vercel Analytics**: Built-in for Vercel deployments
- **Google Analytics**: Add tracking code to index.html
- **Sentry**: For error tracking
- **LogRocket**: For session replay

## Troubleshooting

### Issue: Blank page after deployment

**Solution:** Check browser console for errors. Usually caused by incorrect base path in vite.config.js

### Issue: 404 on page refresh

**Solution:** Configure your server to serve index.html for all routes (SPA routing)

### Issue: Environment variables not working

**Solution:** Ensure variables are prefixed with `VITE_` and rebuild after adding them

### Issue: Slow initial load

**Solution:** 
- Enable compression
- Use CDN
- Check bundle size with `npm run build -- --analyze`

## Security Considerations

1. **API Keys**: Never commit API keys to Git
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS properly if using external APIs
4. **CSP**: Consider adding Content Security Policy headers
5. **Rate Limiting**: Implement rate limiting for API calls

## Continuous Deployment

### GitHub Actions Example:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Support

For deployment issues, check:
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
