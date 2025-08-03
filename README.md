# VinValuation Pro Backend API

A Node.js backend that combines VIN decoding with Claude AI market analysis to provide comprehensive vehicle valuations.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 16+ installed
- Claude API key from [console.anthropic.com](https://console.anthropic.com/)

### 2. Setup

```bash
# Create project directory
mkdir vinvaluation-backend
cd vinvaluation-backend

# Initialize npm and install dependencies
npm init -y
npm install express cors axios dotenv
npm install -D nodemon

# Create the files (copy the code from artifacts above)
touch server.js test-api.js .env

# Copy .env.example to .env and add your Claude API key
cp .env.example .env
```

### 3. Configure Environment Variables

Edit `.env` file:
```bash
PORT=3001
NODE_ENV=development
AUTO_DEV_API_KEY=ZrQEPSkKbWtyb2djcnlwdG9AZ21haWwuY29t
CLAUDE_API_KEY=your_actual_claude_api_key_here
```

### 4. Start the Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### POST `/api/valuation`
Main endpoint that processes a VIN and returns comprehensive valuation.

**Request:**
```json
{
  "vin": "1G1ZD5ST8JF134138"
}
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-02-01T12:00:00.000Z",
  "vin": "1G1ZD5ST8JF134138",
  "vehicle": {
    "year": 2018,
    "make": "Chevrolet",
    "model": "Malibu",
    "trim": "LT",
    "engine": "1.5L Turbo",
    "transmission": "6-Speed Automatic"
  },
  "market_analysis": "Detailed Claude analysis...",
  "report_id": "VVP-1234567890"
}
```

### POST `/api/validate-vin`
Free VIN validation (no API calls).

**Request:**
```json
{
  "vin": "1G1ZD5ST8JF134138"
}
```

### GET `/api/health`
Health check endpoint.

### GET `/api/sample-vins`
Returns test VINs for development.

## 🧪 Testing

```bash
# Run the test suite
npm test

# Or run directly
node test-api.js
```

## 💰 Cost Analysis

### Per Request Costs:
- **Auto.dev API:** Free (included in their plan)
- **Claude API:** ~$0.08-0.15 per request
- **Total Cost:** ~$0.10 per valuation

### Pricing Strategy:
- **Consumer Reports:** $4.99 (98% profit margin)
- **Dealer API:** $0.50-1.00 per request
- **Enterprise:** Custom pricing

## 🔧 Development Tips

### Adding Caching
To reduce costs, add Redis caching for recent VIN lookups:

```javascript
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Check cache before API calls
const cachedResult = await client.get(`vin:${vin}`);
if (cachedResult) {
  return JSON.parse(cachedResult);
}

// Cache result for 24 hours
await client.setex(`vin:${vin}`, 86400, JSON.stringify(result));
```

### Adding Database Storage
Store VIN lookups to build your proprietary database:

```javascript
// After successful valuation
await db.query(`
  INSERT INTO valuations (vin, vehicle_data, analysis, created_at)
  VALUES ($1, $2, $3, NOW())
`, [vin, vehicleSpecs, claudeAnalysis]);
```

### Error Handling
The API handles common errors:
- Invalid VIN format
- VIN not found in database
- Claude API failures
- Rate limiting
- Network timeouts

## 🚀 Deployment Options

### Heroku (Easiest)
```bash
# Install Heroku CLI, then:
heroku create vinvaluation-api
heroku config:set CLAUDE_API_KEY=your_key_here
git push heroku main
```

### Vercel
```bash
# Install Vercel CLI, then:
vercel
# Add environment variables in Vercel dashboard
```

### Railway
```bash
# Connect GitHub repo to Railway
# Add environment variables in Railway dashboard
```

## 📊 Monitoring & Analytics

Add these for production:

```javascript
// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Response timing
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.path} completed in ${duration}ms`);
  });
  next();
});
```

## 🔐 Security Considerations

1. **API Key Protection:** Never commit API keys to git
2. **Rate Limiting:** Add express-rate-limit for production
3. **Input Validation:** VIN format is validated, but add more checks
4. **CORS Configuration:** Restrict origins in production
5. **HTTPS Only:** Use SSL certificates in production

## 📈 Scaling Considerations

- **Horizontal Scaling:** Stateless design allows multiple instances
- **Database:** Add PostgreSQL for persistent storage
- **Caching:** Redis for frequently requested VINs
- **CDN:** CloudFlare for global distribution
- **Load Balancer:** For high-traffic scenarios

## 🤝 Next Steps

1. **Test the API** with sample VINs
2. **Add database** for storing results
3. **Build frontend** to consume this API
4. **Add user authentication** for paid features
5. **Implement caching** to reduce costs
6. **Add monitoring** and analytics
7. **Deploy to production** platform

---

**Ready to start making money with vehicle valuations! 🚗💰**