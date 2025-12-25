# Q-Ease Deployment Guide

This guide provides step-by-step instructions for deploying Q-Ease to production.

## Prerequisites Checklist

Before deploying, ensure you have:

- [ ] GitHub account
- [ ] Vercel account (for frontend)
- [ ] Render/Railway account (for backend)
- [ ] Neon/Supabase account (for PostgreSQL)
- [ ] Upstash account (for Redis)
- [ ] Firebase account (for push notifications)
- [ ] Brevo account (for email notifications)
- [ ] Domain name (optional)

## Step 1: Database Setup (Neon PostgreSQL)

1. **Create Neon Account**
   - Go to https://neon.tech
   - Sign up and create a new project

2. **Create Database**
   - Project name: `qease-production`
   - Region: Choose closest to your users
   - PostgreSQL version: 15+

3. **Get Connection Details**
   - Copy the connection string
   - Format: `postgresql://user:password@host/database?sslmode=require`

4. **Run Database Schema**
   - Connect to your database using psql or a GUI tool
   - Execute the SQL from `backend/docs/database-schema.md`
   
   ```bash
   psql "postgresql://user:password@host/database?sslmode=require" < backend/docs/database-schema.md
   ```

## Step 2: Redis Setup (Upstash)

1. **Create Upstash Account**
   - Go to https://upstash.com
   - Sign up and create a new Redis database

2. **Create Redis Database**
   - Name: `qease-redis`
   - Region: Same as your backend deployment
   - Type: Regional (for lower latency)

3. **Get Connection Details**
   - Copy Redis URL
   - Copy Redis password
   - Note the host and port

## Step 3: Firebase Setup (Push Notifications)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com
   - Create new project: `qease-notifications`

2. **Enable Cloud Messaging**
   - Navigate to Project Settings > Cloud Messaging
   - Enable Cloud Messaging API

3. **Generate Service Account**
   - Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file

4. **Extract Credentials**
   - Open the downloaded JSON file
   - Extract these values:
     - `project_id`
     - `private_key`
     - `client_email`

## Step 4: Email Setup (Brevo)

1. **Create Brevo Account**
   - Go to https://www.brevo.com
   - Sign up for free tier (300 emails/day)

2. **Get SMTP Credentials**
   - Navigate to SMTP & API
   - Copy SMTP server details:
     - Server: `smtp-relay.brevo.com`
     - Port: `587`
     - Login: Your email
     - Password: SMTP key

## Step 5: Backend Deployment (Render)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" > "Web Service"
   - Connect your GitHub repository
   - Select `backend` directory
   - Configuration:
     - Name: `qease-backend`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Instance Type: `Free` or `Starter`

3. **Set Environment Variables**
   Add these in Render dashboard:
   
   ```
   NODE_ENV=production
   PORT=5000
   
   # Database (from Neon)
   DB_HOST=your-neon-host.neon.tech
   DB_PORT=5432
   DB_NAME=qease_db
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   
   # Redis (from Upstash)
   REDIS_HOST=your-redis-host.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=your-redis-password
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
   JWT_EXPIRE=7d
   
   # Email (from Brevo)
   EMAIL_HOST=smtp-relay.brevo.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@domain.com
   EMAIL_PASS=your-brevo-smtp-key
   
   # Firebase (from service account JSON)
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email@project.iam.gserviceaccount.com
   
   # Frontend URL (will update after Vercel deployment)
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://qease-backend.onrender.com`)

## Step 6: Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select `frontend` directory
   - Framework Preset: `Vite`

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   VITE_API_URL=https://qease-backend.onrender.com/api
   VITE_SOCKET_URL=https://qease-backend.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Note your frontend URL (e.g., `https://qease.vercel.app`)

6. **Update Backend FRONTEND_URL**
   - Go back to Render dashboard
   - Update `FRONTEND_URL` environment variable
   - Redeploy backend

## Step 7: Configure GitHub Actions (Optional)

1. **Add Secrets to GitHub Repository**
   
   Navigate to: Repository > Settings > Secrets and Variables > Actions
   
   Add these secrets:
   
   **For Frontend:**
   - `VERCEL_TOKEN` - From Vercel account settings
   - `VERCEL_ORG_ID` - From Vercel project settings
   - `VERCEL_PROJECT_ID` - From Vercel project settings
   
   **For Backend:**
   - `RENDER_API_KEY` - From Render account settings
   - `RENDER_SERVICE_ID` - From Render service settings

2. **Test Automatic Deployment**
   - Make a small change in your code
   - Commit and push to main branch
   - Check GitHub Actions tab for deployment status

## Step 8: Domain Configuration (Optional)

### Custom Domain for Frontend (Vercel)

1. In Vercel dashboard, go to your project
2. Click "Settings" > "Domains"
3. Add your custom domain (e.g., `qease.com`)
4. Follow Vercel's DNS configuration instructions

### Custom Domain for Backend (Render)

1. In Render dashboard, go to your service
2. Click "Settings" > "Custom Domain"
3. Add your domain (e.g., `api.qease.com`)
4. Configure DNS with provided CNAME record

## Step 9: SSL/HTTPS Configuration

Both Vercel and Render automatically provide SSL certificates for:
- Default subdomains (.vercel.app, .onrender.com)
- Custom domains

No manual configuration needed! 🎉

## Step 10: Testing Your Deployment

1. **Test Frontend**
   - Visit your Vercel URL
   - Check if pages load correctly
   - Test navigation

2. **Test Backend API**
   ```bash
   curl https://your-backend-url.onrender.com/
   # Should return: {"message":"Q-Ease Backend API is running!"}
   ```

3. **Test Authentication**
   ```bash
   curl -X POST https://your-backend-url.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123","full_name":"Test User"}'
   ```

4. **Test Real-time Features**
   - Create a token
   - Check if Socket.IO connection works
   - Verify real-time updates

## Step 11: Monitoring & Maintenance

### Set Up Monitoring

1. **Render Monitoring**
   - Check service logs regularly
   - Set up alerts for downtime
   - Monitor resource usage

2. **Vercel Analytics**
   - Enable Vercel Analytics
   - Monitor page performance
   - Track user visits

3. **Database Monitoring**
   - Monitor Neon dashboard
   - Check query performance
   - Set up backup schedules

### Regular Maintenance Tasks

- [ ] Check error logs weekly
- [ ] Update dependencies monthly
- [ ] Review security alerts
- [ ] Backup database weekly
- [ ] Monitor Redis memory usage
- [ ] Check notification delivery rates

## Troubleshooting

### Common Issues

**Issue: Backend not connecting to database**
- Solution: Check DB credentials in environment variables
- Verify Neon database is active
- Check SSL mode in connection string

**Issue: Frontend can't reach backend**
- Solution: Verify CORS is configured correctly
- Check FRONTEND_URL in backend env variables
- Ensure API URLs are correct in frontend

**Issue: Socket.IO not working**
- Solution: Check WebSocket support in hosting
- Verify Socket.IO client version matches server
- Check firewall/security group settings

**Issue: Notifications not sending**
- Solution: Verify email/Firebase credentials
- Check BullMQ queue is processing jobs
- Monitor Redis connection

**Issue: Build failing on Vercel/Render**
- Solution: Check build logs for errors
- Verify all dependencies are in package.json
- Check Node.js version compatibility

## Performance Optimization

1. **Enable Caching**
   - Configure Redis caching
   - Set appropriate cache TTLs
   - Use CDN for static assets

2. **Database Optimization**
   - Create indexes on frequently queried columns
   - Optimize slow queries
   - Use connection pooling

3. **Frontend Optimization**
   - Enable code splitting
   - Optimize images
   - Lazy load components

## Security Checklist

- [ ] All environment variables are set
- [ ] JWT secret is strong (32+ characters)
- [ ] Database passwords are strong
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled (if needed)
- [ ] Input validation is working
- [ ] SQL injection protection is in place
- [ ] XSS protection is enabled
- [ ] HTTPS is enforced

## Scaling Considerations

When your app grows:

1. **Upgrade Render Instance**
   - Move from Free to Starter or Standard
   - Enable autoscaling

2. **Upgrade Database**
   - Increase Neon compute units
   - Enable read replicas

3. **Upgrade Redis**
   - Increase Upstash memory
   - Enable high availability

4. **Add Load Balancer**
   - Use Render's load balancing
   - Configure multiple instances

## Backup Strategy

1. **Database Backups**
   - Neon provides automatic daily backups
   - Configure backup retention period
   - Test restore procedure

2. **Configuration Backups**
   - Keep .env.example updated
   - Document all environment variables
   - Store secrets in secure vault

## Support & Resources

- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **Neon Documentation**: https://neon.tech/docs
- **Upstash Documentation**: https://docs.upstash.com

---

**Deployment Status:** Ready for Production ✅
**Estimated Time:** 1-2 hours for complete setup
**Difficulty:** Intermediate

Good luck with your deployment! 🚀
