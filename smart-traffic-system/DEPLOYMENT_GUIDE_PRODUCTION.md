# DriveLegal Smart Traffic - Production Deployment Guide

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#checklist)
2. [Environment Setup](#environment)
3. [Database Configuration](#database)
4. [Security Configuration](#security)
5. [Deployment Steps](#deployment)
6. [Monitoring & Logs](#monitoring)
7. [Scaling & Performance](#scaling)
8. [Troubleshooting](#troubleshooting)

---

## 🔍 Pre-Deployment Checklist {#checklist}

- [ ] All tests passing (`npm test`)
- [ ] Environment variables configured
- [ ] MongoDB connection verified
- [ ] SSL certificates obtained
- [ ] Backend builds successfully (`npm run build`)
- [ ] Frontend builds successfully (Next.js build)
- [ ] API endpoints tested
- [ ] WebSocket connections verified
- [ ] Database migrations completed
- [ ] Backup strategy implemented
- [ ] Monitoring alerts configured
- [ ] Team trained on deployment process

---

## 🌍 Environment Setup {#environment}

### Development Environment Variables

Create `.env.development`:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/traffic-dev
DB_NAME=traffic-dev

# Server
NODE_ENV=development
PORT=5000
HOST=localhost

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# JWT
JWT_SECRET=your-dev-secret-key-change-in-production
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRY=30d

# Email (optional for dev)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=465
SMTP_USER=your-email
SMTP_PASS=your-password

# Razorpay (optional for dev)
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# ML/AI
ML_API_TIMEOUT=30000
PREDICTION_CACHE_TTL=300000
```

### Production Environment Variables

Create `.env.production`:

```bash
# Database - Use managed database service
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/traffic-prod
DB_NAME=traffic-prod
DB_POOL_SIZE=50

# Server
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Frontend
NEXT_PUBLIC_API_URL=https://api.drivelegal.com
NEXT_PUBLIC_SOCKET_URL=https://api.drivelegal.com

# JWT - Use strong, unique secrets
JWT_SECRET=generate-strong-random-secret-here
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=generate-another-strong-secret
REFRESH_TOKEN_EXPIRY=30d

# Email - Production email service
SMTP_HOST=your-production-smtp.com
SMTP_PORT=465
SMTP_USER=production@drivelegal.com
SMTP_PASS=production-password
EMAIL_FROM=noreply@drivelegal.com

# Razorpay - Production keys
RAZORPAY_KEY_ID=production-key-id
RAZORPAY_KEY_SECRET=production-key-secret

# ML/AI - Production settings
ML_API_TIMEOUT=30000
PREDICTION_CACHE_TTL=600000

# Security
ENABLE_RATE_LIMITING=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/drivelegal/app.log

# Session
SESSION_SECRET=generate-strong-session-secret
SESSION_MAX_AGE=86400000
```

---

## 🗄️ Database Configuration {#database}

### MongoDB Atlas Setup (Recommended)

1. **Create MongoDB Atlas Account**
   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Click "Create Database"
   - Choose M0 Sandbox (free) for testing
   - Select region close to deployment
   - Create cluster

3. **Configure Network Access**
   - Go to "Network Access"
   - Add IP: `0.0.0.0/0` (for development)
   - For production, add specific IPs

4. **Create Database User**
   - Go to "Database Access"
   - Create user with strong password
   - Grant "Atlas admin" role

5. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<username>` and `<password>`

### Database Migrations

```bash
# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Seed advanced ML data
npm run db:seed:advanced
```

### Database Indexing

```javascript
// Ensure indexes for performance
db.junctions.createIndex({ "coordinates": "2dsphere" });
db.vehicleflows.createIndex({ "junction": 1, "timestamp": -1 });
db.trafficpredictions.createIndex({ "junction": 1, "timestamp": -1 });
db.users.createIndex({ "email": 1 }, { unique: true });
db.recommendations.createIndex({ "zone": 1, "timestamp": -1 });
```

---

## 🔒 Security Configuration {#security}

### SSL/TLS Certificates

#### Option 1: Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d api.drivelegal.com

# Auto-renew setup
sudo systemctl enable certbot.timer
```

#### Option 2: Self-signed (Development)

```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
```

### HTTPS Configuration

```javascript
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/api.drivelegal.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/api.drivelegal.com/fullchain.pem')
};

https.createServer(options, app).listen(443);
```

### Security Headers

```javascript
import helmet from 'helmet';

app.use(helmet());

// Additional CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://drivelegal.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);
```

---

## 🚀 Deployment Steps {#deployment}

### Option 1: Docker Deployment

#### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
COPY .env.production .env

EXPOSE 5000
CMD ["node", "backend/server.js"]
```

#### Create docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5
    container_name: traffic-db
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${DB_PASSWORD}

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: traffic-backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      MONGODB_URI: mongodb://admin:${DB_PASSWORD}@mongodb:27017/traffic-prod
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: traffic-frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  mongo_data:
```

#### Deploy with Docker

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Option 2: Traditional Deployment (Ubuntu/CentOS)

#### Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
sudo apt install -y mongodb-org

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

#### Deploy Backend

```bash
# Clone repository
git clone https://github.com/drivelegal/smart-traffic.git
cd smart-traffic/smart-traffic-system/backend

# Install dependencies
npm install --production

# Copy environment file
cp .env.example .env.production
# Edit .env.production with actual values

# Build (if needed)
npm run build

# Start with PM2
pm2 start server.js --name "traffic-backend"
pm2 startup
pm2 save

# View logs
pm2 logs traffic-backend
```

#### Deploy Frontend

```bash
# In frontend directory
cd ../../src

# Install dependencies
npm install

# Build Next.js
npm run build

# Start with PM2
pm2 start "npm start" --name "traffic-frontend"
pm2 save
```

#### Configure Nginx

```nginx
upstream backend {
    server localhost:5000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name api.drivelegal.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.drivelegal.com;

    ssl_certificate /etc/letsencrypt/live/api.drivelegal.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.drivelegal.com/privkey.pem;

    # API proxy
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Option 3: Cloud Deployment (Render/Heroku)

#### Deploy to Render.com

1. **Create Render Account**
   - Visit https://render.com
   - Sign in with GitHub

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect GitHub repository
   - Select repository and branch

3. **Configure Service**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node
   - Plan: Standard (recommended for production)

4. **Add Environment Variables**
   - Add all variables from `.env.production`

5. **Deploy**
   - Click "Create Web Service"
   - Service deploys automatically

#### Deploy to Heroku (Alternative)

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create drivelegal-traffic

# Add MongoDB Atlas
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## 📊 Monitoring & Logs {#monitoring}

### Application Monitoring

#### PM2 Monitoring

```bash
# Install PM2 Plus
pm2 plus

# Monitor with web dashboard
pm2 web

# Access at http://localhost:9615
```

#### Sentry Error Tracking

```javascript
import Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.errorHandler());
```

### Database Monitoring

```bash
# Monitor MongoDB Atlas
# Visit https://cloud.mongodb.com → Metrics

# Local MongoDB monitoring
mongosh
db.serverStatus()
db.currentOp()
```

### Log Management

#### Centralized Logging with ELK Stack

```bash
# Install Elasticsearch, Logstash, Kibana
docker run -d --name elasticsearch docker.elastic.co/elasticsearch/elasticsearch:8.0.0
docker run -d --name kibana docker.elastic.co/kibana/kibana:8.0.0
```

#### Application Logging

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

---

## 📈 Scaling & Performance {#scaling}

### Horizontal Scaling

```yaml
# docker-compose scaling
version: '3.8'
services:
  backend:
    deploy:
      replicas: 3  # Scale to 3 instances
    restart: always
```

### Load Balancing

```nginx
upstream backend_cluster {
    server backend1.example.com:5000;
    server backend2.example.com:5000;
    server backend3.example.com:5000;
}

server {
    location /api {
        proxy_pass http://backend_cluster;
        proxy_set_header Host $host;
    }
}
```

### Caching Strategy

```javascript
import redis from 'redis';

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// Cache predictions for 5 minutes
router.get('/predictions/:junction', async (req, res) => {
  const cacheKey = `prediction:${req.params.junction}`;
  const cached = await client.get(cacheKey);
  
  if (cached) return res.json(JSON.parse(cached));
  
  const data = await getPrediction(req.params.junction);
  await client.setex(cacheKey, 300, JSON.stringify(data));
  res.json(data);
});
```

### Database Optimization

```javascript
// Connection pooling
mongoose.connect(mongoURI, {
  maxPoolSize: 50,
  minPoolSize: 10,
  maxIdleTimeMS: 45000
});

// Query optimization
db.vehicles.createIndex({ location: "2dsphere" });
db.predictions.createIndex({ timestamp: -1 });
db.recommendations.createIndex({ zone: 1, created_at: -1 });
```

---

## 🔧 Troubleshooting {#troubleshooting}

### Common Issues

#### Connection Refused

```bash
# Check if service is running
sudo systemctl status mongodb

# Restart service
sudo systemctl restart mongodb

# Check port availability
lsof -i :5000
```

#### High Memory Usage

```bash
# Check memory
free -h

# Kill process using memory
kill -9 <PID>

# Restart with memory limits
docker run -m 2g backend-service
```

#### Database Connection Issues

```bash
# Test MongoDB connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/test"

# Check connection pool
db.serverStatus().connections

# Increase connection pool if needed
```

#### WebSocket Not Working

```javascript
// Check Socket.IO configuration
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});

// Debug socket events
socket.onAny((event, ...args) => {
  console.log(event, args);
});
```

### Performance Tuning

```bash
# Increase file descriptors
ulimit -n 65536

# Tune kernel parameters
sysctl -w net.core.somaxconn=65535
sysctl -w net.ipv4.tcp_max_syn_backlog=65535

# Monitor with htop
htop
```

---

## 📞 Support & Contact

- **Documentation**: https://docs.drivelegal.com
- **Issues**: https://github.com/drivelegal/issues
- **Email**: support@drivelegal.com
- **Slack**: #traffic-support

---

**Last Updated**: 2024
**Version**: 1.0
