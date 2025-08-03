# VinValuation Pro Backend API

A Node.js backend that combines VIN decoding with Claude AI market analysis to provide comprehensive vehicle valuations. Built with modular architecture and comprehensive testing capabilities.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- Claude API key from [console.anthropic.com](https://console.anthropic.com/)

### 2. Setup

```bash
# Clone or create project directory
git clone <your-repo> vinvaluation-backend
cd vinvaluation-backend

# Install dependencies
npm install

# Create .env file with your API keys
cp .env.example .env
```

### 3. Configure Environment Variables

Edit `.env` file:
```bash
PORT=3001
NODE_ENV=development
AUTO_DEV_API_KEY=your_auto_dev_api_key_here
CLAUDE_API_KEY=your_claude_api_key_here
```

**Required API Keys:**
- **Claude API Key**: Get from [console.anthropic.com](https://console.anthropic.com/)
- **Auto.dev API Key**: Get from [auto.dev](https://auto.dev/)

### 4. Start the Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### POST `/api/valuation`
Main endpoint that processes a VIN and returns comprehensive valuation using Claude AI.

**Request:**
```json
{
  "vin": "1G1ZD5ST8JF134138",
  "condition": "good"
}
```

**Condition Options:**
- `excellent` (+10-15% above base value)
- `good` (base market value - default)
- `fair` (-10-15% below base value)
- `poor` (-20-30% below base value)

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

### POST `/api/test-valuation`
Fast testing endpoint that uses mock responses (no API costs).

**Request:**
```json
{
  "vin": "1G1ZD5ST8JF134138",
  "condition": "good"
}
```

**Available Test VINs:**
- `1G1ZD5ST8JF134138` - 2018 Chevrolet Malibu
- `1HGBH41JXMN109186` - 2021 Honda Civic
- `1FTFW1ET5DFC10312` - 2013 Ford F-150

### POST `/api/validate-vin`
Free VIN validation (no API calls).

**Request:**
```json
{
  "vin": "1G1ZD5ST8JF134138"
}
```

### GET `/api/health`
Health check endpoint with Claude service status.

### GET `/api/sample-vins`
Returns test VINs for development.

## 🧪 Testing

### Quick Testing (No API Costs)
```bash
# Test with mock responses
curl -X POST http://localhost:3001/api/test-valuation \
  -H "Content-Type: application/json" \
  -d '{"vin": "1G1ZD5ST8JF134138"}'
```

### Full Test Suite
```bash
# Run comprehensive tests
npm test

# Or run directly
node test-api.js
```

### Test Modes
- **Development**: Uses real Claude API calls
- **Test Mode**: Uses mock responses when `NODE_ENV=test`
- **Mock Endpoint**: Always uses test data for fast development

## 💰 Cost Analysis

### Per Request Costs:
- **Auto.dev API:** Free (included in their plan)
- **Claude API:** ~$0.08-0.15 per request
- **Total Cost:** ~$0.10 per valuation

### Pricing Strategy:
- **Consumer Reports:** $4.99 (98% profit margin)
- **Dealer API:** $0.50-1.00 per request
- **Enterprise:** Custom pricing

## 🏗️ Project Structure

```
autovalidation-backend/
├── server.js              # Main Express server with routes
├── claude-service.js      # Claude AI integration module
├── test-responses.js      # Mock responses for testing
├── test-api.js           # Comprehensive API testing
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (not in git)
└── README.md            # This file
```

## 🔧 Development Tips

### Modular Architecture
- **`claude-service.js`**: Handles all Claude AI interactions
- **`test-responses.js`**: Mock data for development
- **`server.js`**: Clean route handling and business logic

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

## 🚀 Features

### ✅ **Core Functionality**
- **VIN Decoding**: Extract vehicle specifications using auto.dev API
- **AI Analysis**: Claude AI-powered market analysis and valuation
- **Comprehensive Reports**: Detailed market values, trends, and recommendations
- **Error Handling**: Robust error handling for all API interactions

### ✅ **Development Features**
- **Modular Architecture**: Clean separation of concerns
- **Mock Testing**: Fast development without API costs
- **Comprehensive Testing**: Full test suite with multiple scenarios
- **Health Monitoring**: Service status and API key validation

### ✅ **Production Ready**
- **Environment Configuration**: Secure API key management
- **CORS Support**: Cross-origin request handling
- **Input Validation**: VIN format validation
- **Response Formatting**: Consistent JSON responses

## 🤝 Next Steps

1. **Test the API** with sample VINs using `/api/test-valuation`
2. **Add database** for storing results and building proprietary data
3. **Build frontend** to consume this API
4. **Add user authentication** for paid features
5. **Implement caching** to reduce costs
6. **Add monitoring** and analytics
7. **Deploy to production** platform

---

**Ready to start making money with vehicle valuations! 🚗💰**