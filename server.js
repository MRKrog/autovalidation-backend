const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables needed:
// AUTO_DEV_API_KEY=ZrQEPSkKbWtyb2djcnlwdG9AZ21haWwuY29t
// CLAUDE_API_KEY=your_claude_api_key_here

// VIN validation helper
const isValidVIN = (vin) => {
  return vin && vin.length === 17 && /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
};

// Claude API integration
const analyzeVehicleWithClaude = async (vehicleData) => {
  try {
    const prompt = `
You are a professional automotive appraiser and market analyst. Analyze this vehicle and provide a comprehensive valuation report.

Vehicle Details:
- Year: ${vehicleData.year}
- Make: ${vehicleData.make}
- Model: ${vehicleData.model}
- Trim: ${vehicleData.trim || 'Base'}
- Engine: ${vehicleData.engine}
- Transmission: ${vehicleData.transmission}
- Body Style: ${vehicleData.style}
- Drivetrain: ${vehicleData.drivetrain}
- Fuel Type: ${vehicleData.fuel_type}
- Manufacturing Country: ${vehicleData.made_in}

Please provide:
1. Current Market Values (as of ${new Date().toLocaleDateString()}):
   - Retail Value (dealer lot price)
   - Private Party Value (individual seller)
   - Trade-in Value (dealer trade)

2. Market Analysis:
   - Current market demand (High/Medium/Low)
   - Price trend over last 12 months
   - Regional variations to consider

3. Key Factors Affecting Value:
   - Vehicle condition impact
   - Mileage considerations for this model year
   - Common issues or recalls for this vehicle
   - Resale value outlook

4. Strategic Recommendations:
   - Best time to sell/buy
   - Negotiation talking points
   - Market positioning vs competitors

5. Risk Assessment:
   - Reliability concerns
   - Depreciation outlook
   - Market saturation

Please provide specific dollar amounts based on current market conditions and format your response as a detailed professional report.
`;

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.CLAUDE_API_KEY}`,
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY
      }
    });

    return response.data.content[0].text;
  } catch (error) {
    console.error('Claude API Error:', error.response?.data || error.message);
    throw new Error('Failed to analyze vehicle with Claude');
  }
};

// Main VIN valuation endpoint
app.post('/api/valuation', async (req, res) => {
  try {
    const { vin } = req.body;
    
    // Validate VIN
    if (!isValidVIN(vin)) {
      return res.status(400).json({
        error: 'Invalid VIN',
        message: 'VIN must be exactly 17 characters and contain only valid characters'
      });
    }

    console.log(`Processing VIN: ${vin}`);

    // Step 1: Decode VIN using auto.dev API
    const autoDevResponse = await axios.get(
      `https://auto.dev/api/vin/${vin}?apikey=${process.env.AUTO_DEV_API_KEY}`
    );

    const vehicleSpecs = autoDevResponse.data;
    
    // Check if VIN was successfully decoded
    if (!vehicleSpecs || vehicleSpecs.error) {
      return res.status(404).json({
        error: 'VIN not found',
        message: 'Unable to decode VIN. Please verify the VIN is correct.'
      });
    }

    console.log('Vehicle decoded successfully:', vehicleSpecs.year, vehicleSpecs.make, vehicleSpecs.model);

    // Step 2: Analyze with Claude
    const claudeAnalysis = await analyzeVehicleWithClaude(vehicleSpecs);

    // Step 3: Structure the response
    const valuationReport = {
      success: true,
      timestamp: new Date().toISOString(),
      vin: vin.toUpperCase(),
      vehicle: {
        year: vehicleSpecs.year,
        make: vehicleSpecs.make,
        model: vehicleSpecs.model,
        trim: vehicleSpecs.trim,
        style: vehicleSpecs.style,
        engine: vehicleSpecs.engine,
        transmission: vehicleSpecs.transmission,
        drivetrain: vehicleSpecs.drivetrain,
        fuel_type: vehicleSpecs.fuel_type,
        made_in: vehicleSpecs.made_in,
        msrp: vehicleSpecs.msrp
      },
      market_analysis: claudeAnalysis,
      report_id: `VVP-${Date.now()}`,
      generated_by: 'VinValuation Pro API v1.0'
    };

    res.json(valuationReport);

  } catch (error) {
    console.error('API Error:', error);
    
    if (error.response) {
      // External API error
      return res.status(error.response.status).json({
        error: 'External API Error',
        message: 'Unable to process request. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // Internal server error
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong processing your request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// VIN validation endpoint (free check)
app.post('/api/validate-vin', (req, res) => {
  const { vin } = req.body;
  
  const isValid = isValidVIN(vin);
  
  res.json({
    vin: vin?.toUpperCase(),
    valid: isValid,
    message: isValid ? 'Valid VIN format' : 'Invalid VIN format'
  });
});

// Sample VINs endpoint for testing
app.get('/api/sample-vins', (req, res) => {
  res.json({
    sample_vins: [
      {
        vin: '1G1ZD5ST8JF134138',
        description: '2018 Chevrolet Malibu'
      },
      {
        vin: '1HGBH41JXMN109186',
        description: '2021 Honda Civic'
      },
      {
        vin: '1FTFW1ET5DFC10312',
        description: '2013 Ford F-150'
      }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚗 VinValuation API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Main endpoint: POST http://localhost:${PORT}/api/valuation`);
  
  // Verify environment variables
  if (!process.env.AUTO_DEV_API_KEY) {
    console.warn('⚠️  AUTO_DEV_API_KEY not set');
  }
  if (!process.env.CLAUDE_API_KEY) {
    console.warn('⚠️  CLAUDE_API_KEY not set');
  }
});

module.exports = app;