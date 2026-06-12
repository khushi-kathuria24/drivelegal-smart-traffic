# 🚀 Production Deployment Guide

## 📋 Pre-Deployment Checklist

### Backend Configuration
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables configured
- [ ] JWT_SECRET updated (strong random string)
- [ ] CORS_ORIGIN set to production domain
- [ ] API_PORT set appropriately
- [ ] Payment provider credentials configured

### Frontend Configuration
- [ ] NEXT_PUBLIC_API_URL points to production backend
- [ ] NEXT_PUBLIC_SOCKET_URL points to production backend
- [ ] API calls use correct endpoints
- [ ] WebSocket reconnection configured

### Security
- [ ] JWT tokens expire appropriately
- [ ] Refresh token rotation enabled
- [ ] HTTPS enforced
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] Sensitive data not logged

### Database
- [ ] Backup strategy configured
- [ ] Indexes created on frequently queried fields
- [ ] Connection pooling configured
- [ ] Replicas set up (if applicable)

### Monitoring
- [ ] Error tracking (Sentry/Datadog)
- [ ] Performance monitoring
- [ ] Application logs centralized
- [ ] Alert system configured
- [ ] Uptime monitoring enabled

---

## 🌐 Deployment Options

### Option 1: Render (Recommended for Both)

#### Backend Deployment
```bash
# 1. Connect GitHub repo to Render
# 2. Create new Web Service
# 3. Configure:
Build Command: npm install && npm run build
Start Command: npm run server
Environment Variables:
  MONGODB_URI: [Atlas connection string]
  JWT_SECRET: [strong random string]
  CORS_ORIGIN: https://yourdomain.com
  NODE_ENV: production
```

#### Frontend Deployment
```bash
# 1. Connect GitHub repo to Render
# 2. Create new Static Site
# 3. Configure:
Build Command: npm install && npm run build
Publish Directory: .next
Environment Variables:
  NEXT_PUBLIC_API_URL: https://api.yourdomain.com
  NEXT_PUBLIC_SOCKET_URL: https://api.yourdomain.com
```

### Option 2: Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel)
```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys
# Configure env variables in Vercel dashboard:
NEXT_PUBLIC_API_URL: https://api.yourdomain.com
NEXT_PUBLIC_SOCKET_URL: https://api.yourdomain.com
```

#### Backend (Railway)
```bash
# Railway CLI
railway login
railway init
railway add
railway up

# Set environment variables in Railway dashboard
```

---

## 🔐 Environment Variables

### Production (.env.production)
```
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/drivelegal-traffic

# Security
JWT_SECRET=your_super_secure_random_string_here_min_32_chars
JWT_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d

# Server
NODE_ENV=production
API_PORT=5000
CORS_ORIGIN=https://yourdomain.com

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com

# Payment
PAYMENT_PROVIDER=razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Logging
LOG_LEVEL=info
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Upload
UPLOAD_DIR=/uploads
MAX_FILE_SIZE=10485760
```

---

## 📊 Database Indexes

Create these indexes in MongoDB for performance:

```javascript
// Users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1, authority: 1 });
db.users.createIndex({ jurisdictionArea: 1 });

// Challans collection
db.challans.createIndex({ vehicleNumber: 1 });
db.challans.createIndex({ issuedBy: 1, createdAt: -1 });
db.challans.createIndex({ status: 1 });
db.challans.createIndex({ createdAt: -1 });

// Violations collection
db.violations.createIndex({ documentedBy: 1 });
db.violations.createIndex({ violationType: 1 });
db.violations.createIndex({ createdAt: -1 });

// Traffic Signals collection
db.trafficsignals.createIndex({ location: 1 });
db.trafficsignals.createIndex({ zoneId: 1 });
db.trafficsignals.createIndex({ l1AgentId: 1 });

// Incidents collection
db.incidents.createIndex({ status: 1 });
db.incidents.createIndex({ type: 1 });
db.incidents.createIndex({ createdAt: -1 });

// Zones collection
db.zones.createIndex({ zoneId: 1 }, { unique: true });
db.zones.createIndex({ type: 1 });
```

---

## 📈 Performance Optimization

### Backend
```javascript
// Enable compression
import compression from 'compression';
app.use(compression());

// Connection pooling
mongoose.connection.setMaxListeners(0);
const db = mongoose.connection;
db.once('open', () => {
  // Configure pool size
});

// Caching
import redis from 'redis';
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});
```

### Frontend
```typescript
// Dynamic imports for code splitting
import dynamic from 'next/dynamic';

const RoadAuthorityDashboard = dynamic(
  () => import('@/app/authority/road-authority/page'),
  { loading: () => <p>Loading...</p> }
);

// Image optimization
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  width={800}
  height={600}
  priority
/>
```

---

## 🔄 Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_WEBHOOK }}
      
      - name: Deploy Frontend
        run: |
          curl -X POST ${{ secrets.VERCEL_DEPLOY_WEBHOOK }}
      
      - name: Run Tests
        run: npm test
      
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "✅ Production deployment completed"
            }
```

---

## 🔍 Monitoring Setup

### Sentry (Error Tracking)
```bash
npm install @sentry/node @sentry/react
```

### DataDog (Performance Monitoring)
```bash
npm install dd-trace
```

### Application Logs
```bash
npm install winston
```

### Uptime Monitoring
- Configure at UptimeRobot.com
- Monitor: `https://yourdomain.com/api/health`
- Alert email when down

---

## 🚨 Rollback Strategy

### Version Control
```bash
# Tag each production release
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0

# Rollback if needed
git checkout v1.0.0
git push -f origin main
```

### Database Backups
```bash
# Automated daily backups
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/drivelegal-traffic"

# Store backups in S3
aws s3 cp dump/ s3://your-bucket/backups/$(date +%Y%m%d)/
```

---

## 📊 Load Testing

### Before Production
```bash
# Install Apache Bench
ab -n 1000 -c 100 https://yourdomain.com/api/health

# Or use k6
k6 run --vus 100 --duration 30s loadtest.js
```

### Stress Testing
```javascript
// loadtest.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
};

export default function() {
  let res = http.get('https://yourdomain.com/api/health');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
```

---

## 🔐 Security Headers

Configure in backend:
```javascript
import helmet from 'helmet';

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
  }
}));
```

---

## 📞 Incident Response

### If Service Goes Down
1. Check monitoring alerts
2. Review logs in Sentry
3. Check database connectivity
4. Restart services if needed
5. Scale up resources if traffic spike
6. Rollback last deployment if code issue

### Escalation Path
- Level 1: Auto-restart services
- Level 2: Page on-call engineer
- Level 3: Declare incident, notify stakeholders
- Level 4: Rollback to last known good version

---

## 📝 Post-Deployment Checklist

- [ ] Health checks passing
- [ ] All dashboards accessible
- [ ] Real-time updates working
- [ ] API responses under 500ms
- [ ] Database queries optimized
- [ ] No errors in production logs
- [ ] WebSocket connections stable
- [ ] Payment processing working
- [ ] Email notifications sending
- [ ] Backups running successfully

---

## 🎯 Production Readiness Criteria

- ✅ All tests passing
- ✅ 99.5% uptime target
- ✅ <2s page load time
- ✅ <500ms API response time
- ✅ 0 critical security issues
- ✅ Database backed up daily
- ✅ 24/7 monitoring active
- ✅ Incident response plan ready
- ✅ Documentation complete
- ✅ Team trained

---

**Version**: 1.0  
**Last Updated**: June 2026  
**Status**: Ready for Production Deployment
