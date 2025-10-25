# ✅ Railway Deployment Checklist

## Pre-Deployment (Local)

### Code & Build
- [ ] Run `npm run build` - Build completes without errors
- [ ] Run `npm run lint` - No linting errors
- [ ] Test locally: `npm run dev` - Frontend works
- [ ] Test API locally: `npm run api` - API starts without errors
- [ ] Test database connection - Can connect to local MySQL

### Files & Configuration
- [ ] `.env.railway` file created
- [ ] `Procfile` file created
- [ ] `railway.json` file created
- [ ] `package.json` has all required scripts
- [ ] `tsconfig.json` is properly configured
- [ ] `vite.config.ts` is properly configured

### Database
- [ ] Local database has all tables
- [ ] Database backup created: `backup.sql`
- [ ] Test data is in database
- [ ] Admin user exists (admin@admin.com)

---

## Railway Account Setup

### Account & Project
- [ ] Railway account created
- [ ] GitHub connected to Railway
- [ ] New Railway project created
- [ ] Repository selected and connected
- [ ] Correct branch selected (main/master)

---

## Database Deployment

### MySQL Service
- [ ] MySQL service created in Railway
- [ ] MySQL is running and accessible
- [ ] Connection details copied:
  - [ ] `MYSQL_HOST`
  - [ ] `MYSQL_USER`
  - [ ] `MYSQL_PASSWORD`
  - [ ] `MYSQL_DATABASE`
  - [ ] `MYSQL_PORT`
- [ ] Database backup imported successfully
- [ ] Tables verified in Railway MySQL
- [ ] Test data present in Railway database

---

## API Service Deployment

### Configuration
- [ ] API service created from GitHub repo
- [ ] Build command set: `npm install`
- [ ] Start command set: `npm run api`
- [ ] Environment variables added:
  - [ ] `MYSQL_HOST=mysql`
  - [ ] `MYSQL_USER=enginedb`
  - [ ] `MYSQL_PASSWORD=***`
  - [ ] `MYSQL_DATABASE=enginedb`
  - [ ] `MYSQL_PORT=3306`
  - [ ] `PORT=3001`
  - [ ] `NODE_ENV=production`
  - [ ] `IMAGE_BASE_URL=https://your-api-domain.railway.app`

### Linking & Deployment
- [ ] MySQL service linked to API service
- [ ] Build completes successfully
- [ ] No errors in deployment logs
- [ ] API service is running
- [ ] API is accessible from internet

### Testing
- [ ] Health check passes: `/api/health`
- [ ] Can fetch products: `/api/products`
- [ ] Can fetch categories: `/api/categories`
- [ ] Database queries work correctly
- [ ] No 500 errors in logs

---

## Frontend Deployment

### Option A: Railway Static
- [ ] Frontend service created
- [ ] Build command: `npm run build`
- [ ] Start command: `npm run preview`
- [ ] Environment variables:
  - [ ] `VITE_API_URL=https://your-api-domain.railway.app`
  - [ ] `VITE_SUPABASE_URL=***`
  - [ ] `VITE_SUPABASE_ANON_KEY=***`
- [ ] Build completes successfully
- [ ] Frontend is accessible

### Option B: Cloudflare Pages
- [ ] GitHub repo connected to Cloudflare
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Environment variables set
- [ ] Build completes successfully
- [ ] Frontend is accessible

### Testing
- [ ] Homepage loads
- [ ] Products display correctly
- [ ] Images load properly
- [ ] Navigation works
- [ ] API calls succeed
- [ ] No console errors

---

## Domain & SSL

### Custom Domains
- [ ] API domain configured in Railway
- [ ] Frontend domain configured
- [ ] DNS records updated:
  - [ ] API domain points to Railway
  - [ ] Frontend domain points to hosting
- [ ] SSL certificates issued (automatic)
- [ ] HTTPS works for both domains
- [ ] No SSL warnings

---

## Functionality Testing

### User Features
- [ ] Homepage loads and displays products
- [ ] Product pages load with details
- [ ] Product images display correctly
- [ ] Search functionality works
- [ ] Filtering works (by category, etc.)
- [ ] Shopping cart works
- [ ] Add to cart functionality
- [ ] Remove from cart functionality
- [ ] Checkout process works
- [ ] Payment integration works (if enabled)
- [ ] Order confirmation displays
- [ ] User can login
- [ ] User can create account
- [ ] User profile works
- [ ] Order history displays

### Admin Features
- [ ] Admin login works (admin@admin.com)
- [ ] Dashboard loads and shows stats
- [ ] Product management works
- [ ] Can add new products
- [ ] Can edit products
- [ ] Can delete products
- [ ] Category management works
- [ ] Order management works
- [ ] Customer management works
- [ ] Settings management works
- [ ] Contact messages display

### API Endpoints
- [ ] GET `/api/health` - Returns ok
- [ ] GET `/api/products` - Returns products
- [ ] GET `/api/categories` - Returns categories
- [ ] GET `/api/orders/user/:id` - Returns user orders
- [ ] POST `/api/cart` - Adds to cart
- [ ] POST `/api/orders` - Creates order
- [ ] POST `/api/auth/login` - Login works
- [ ] POST `/api/auth/signup` - Signup works

---

## Performance & Monitoring

### Performance
- [ ] Frontend loads in < 3 seconds
- [ ] API responds in < 500ms
- [ ] Images are optimized
- [ ] No console errors
- [ ] No network errors

### Monitoring
- [ ] Railway alerts configured
- [ ] Email notifications enabled
- [ ] Logs are accessible
- [ ] Can view real-time logs
- [ ] Error tracking works

### Backups
- [ ] Database backup created
- [ ] Backup stored securely
- [ ] Backup restoration tested
- [ ] Backup schedule planned

---

## Security

### Environment Variables
- [ ] No secrets in code
- [ ] All secrets in Railway variables
- [ ] Passwords are strong
- [ ] API keys are secure
- [ ] Database password is strong

### Database
- [ ] MySQL user has limited permissions
- [ ] Database is not publicly accessible
- [ ] Backups are encrypted
- [ ] Access logs are monitored

### API
- [ ] CORS is properly configured
- [ ] Authentication is required for admin
- [ ] Input validation is in place
- [ ] SQL injection prevention works
- [ ] Rate limiting is configured (optional)

### SSL/HTTPS
- [ ] All traffic is HTTPS
- [ ] SSL certificate is valid
- [ ] No mixed content warnings
- [ ] Security headers are set

---

## Documentation

- [ ] README updated with deployment info
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide created
- [ ] Backup procedure documented

---

## Post-Deployment

### Monitoring (First Week)
- [ ] Check logs daily
- [ ] Monitor error rates
- [ ] Monitor response times
- [ ] Monitor database usage
- [ ] Monitor storage usage

### Maintenance
- [ ] Set up automated backups
- [ ] Plan database maintenance
- [ ] Plan security updates
- [ ] Plan feature updates
- [ ] Document any issues

### Communication
- [ ] Notify users of new deployment
- [ ] Share domain with stakeholders
- [ ] Collect feedback
- [ ] Document feedback
- [ ] Plan improvements

---

## Final Verification

- [ ] All checklist items completed
- [ ] No critical errors in logs
- [ ] All features working as expected
- [ ] Performance is acceptable
- [ ] Security measures in place
- [ ] Backups are working
- [ ] Monitoring is active
- [ ] Team is trained on deployment
- [ ] Documentation is complete
- [ ] Ready for production use

---

## 🎉 Deployment Complete!

**Date Deployed**: _______________
**Deployed By**: _______________
**Notes**: _______________

---

**Deployment Status**: ✅ LIVE
**Uptime**: 99.9%+
**Support**: https://railway.app/support

