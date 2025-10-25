# 🚀 Railway Quick Reference Guide

## Installation & Setup

### Install Railway CLI
```bash
npm install -g @railway/cli
```

### Login to Railway
```bash
railway login
```

### Initialize Railway Project
```bash
railway init
```

---

## Deployment Commands

### Deploy Your Project
```bash
railway up
```

### Deploy Specific Service
```bash
railway up --service api
railway up --service web
```

### View Deployment Status
```bash
railway status
```

### View Logs
```bash
railway logs
```

### View Logs for Specific Service
```bash
railway logs --service api
railway logs --service mysql
```

---

## Environment Variables

### Set Environment Variable
```bash
railway variables set MYSQL_PASSWORD=your_password
railway variables set NODE_ENV=production
```

### View All Variables
```bash
railway variables
```

### Remove Variable
```bash
railway variables unset MYSQL_PASSWORD
```

---

## Database Management

### Connect to Railway MySQL
```bash
railway connect mysql
```

### Backup Database
```bash
mysqldump -h [HOST] -u [USER] -p [PASSWORD] [DB] > backup.sql
```

### Restore Database
```bash
mysql -h [HOST] -u [USER] -p [PASSWORD] [DB] < backup.sql
```

### Get MySQL Connection String
```bash
railway variables | grep MYSQL
```

---

## Troubleshooting

### Check Service Health
```bash
railway status
```

### View Recent Deployments
```bash
railway deployments
```

### Rollback to Previous Deployment
```bash
railway rollback
```

### Restart Service
```bash
railway restart
```

### View Service Logs in Real-time
```bash
railway logs --follow
```

---

## Common Issues & Solutions

### Build Fails
```bash
# Clear cache and rebuild
railway up --force
```

### Can't Connect to Database
```bash
# Check MySQL service is running
railway status

# Verify connection variables
railway variables | grep MYSQL
```

### API Returns 500 Errors
```bash
# Check logs
railway logs --service api

# Verify environment variables
railway variables
```

### Frontend Can't Reach API
```bash
# Verify API URL in frontend
railway variables | grep VITE_API_URL

# Check API is accessible
curl https://your-api-domain.railway.app/api/health
```

---

## Useful Links

| Resource | URL |
|----------|-----|
| Railway Dashboard | https://railway.app/dashboard |
| Railway Docs | https://docs.railway.app |
| Railway CLI Docs | https://docs.railway.app/cli/commands |
| MySQL on Railway | https://docs.railway.app/databases/mysql |
| Environment Variables | https://docs.railway.app/develop/variables |
| Custom Domains | https://docs.railway.app/deploy/exposing-your-app |

---

## Project Structure for Railway

```
projmsql/
├── server/
│   ├── index.js          (API server)
│   ├── db.js             (Database connection)
│   └── authController.js (Auth logic)
├── src/
│   ├── main.tsx          (Frontend entry)
│   ├── App.tsx           (Main component)
│   └── ...
├── public/               (Static files)
├── dist/                 (Built frontend)
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.railway          (Railway env vars)
├── Procfile              (Railway config)
└── railway.json          (Railway schema)
```

---

## Environment Variables Checklist

### Frontend (.env.railway)
- [ ] `VITE_API_URL` - Your Railway API domain
- [ ] `VITE_SUPABASE_URL` - Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Supabase anon key

### Backend (.env.railway)
- [ ] `PORT` - Set to 3001
- [ ] `NODE_ENV` - Set to production
- [ ] `MYSQL_HOST` - Railway MySQL host
- [ ] `MYSQL_USER` - MySQL username
- [ ] `MYSQL_PASSWORD` - MySQL password
- [ ] `MYSQL_DATABASE` - Database name
- [ ] `MYSQL_PORT` - MySQL port (3306)
- [ ] `IMAGE_BASE_URL` - Your API domain

---

## Performance Tips

### Optimize Build
```bash
npm run build:fast
```

### Monitor Resource Usage
```bash
railway status
```

### Scale Services
```bash
# In Railway dashboard: Settings → Scale
# Increase CPU/Memory as needed
```

---

## Backup & Recovery

### Daily Backup Script
```bash
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M%S)
mysqldump -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE > backup-$DATE.sql
```

### Restore from Backup
```bash
mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < backup-YYYYMMDD-HHMMSS.sql
```

---

## Support

- **Railway Support**: https://railway.app/support
- **Community Discord**: https://discord.gg/railway
- **GitHub Issues**: https://github.com/railwayapp/railway/issues

---

**Last Updated**: 2025-10-25
**For Full Guide**: See `RAILWAY_HOSTING_GUIDE.md`

