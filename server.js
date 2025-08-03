const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { analyzeVehicleWithClaude, checkClaudeHealth } = require('./claude-service');
const { getMockResponse, hasMockResponse } = require('./test-responses');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables needed:
// AUTO_DEV_API_KEY=your_auto_dev_api_key_here
// CLAUDE_API_KEY=your_claude_api_key_here

// VIN validation helper
const isValidVIN = (vin) => {
  return vin && vin.length === 17 && /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
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

    // Handle different response formats from auto.dev API
    const vehicleData = {
      year: vehicleSpecs.year || vehicleSpecs.years?.[0]?.year,
      make: vehicleSpecs.make?.name || vehicleSpecs.make,
      model: vehicleSpecs.model?.name || vehicleSpecs.model,
      trim: vehicleSpecs.trim?.name || vehicleSpecs.trim,
      style: vehicleSpecs.style?.name || vehicleSpecs.style,
      engine: vehicleSpecs.engine?.name || vehicleSpecs.engine,
      transmission: vehicleSpecs.transmission?.name || vehicleSpecs.transmission,
      drivetrain: vehicleSpecs.drivetrain?.name || vehicleSpecs.drivetrain,
      fuel_type: vehicleSpecs.fuel_type?.name || vehicleSpecs.fuel_type,
      made_in: vehicleSpecs.made_in || 'Unknown',
      msrp: vehicleSpecs.msrp || 'Unknown'
    };

    console.log('Vehicle decoded successfully:', vehicleData.year, vehicleData.make, vehicleData.model);

    // Step 2: Analyze with Claude (or use mock response in test mode)
    let claudeAnalysis;
    
    // Check if we're in test mode and have a mock response
    if (process.env.NODE_ENV === 'test' && hasMockResponse(vin)) {
      console.log('🧪 Using mock response for testing');
      const mockResponse = getMockResponse(vin);
      claudeAnalysis = mockResponse.market_analysis;
    } else {
      claudeAnalysis = await analyzeVehicleWithClaude(vehicleData);
    }

    // Step 3: Structure the response
    const valuationReport = {
      success: true,
      timestamp: new Date().toISOString(),
      vin: vin.toUpperCase(),
      vehicle: {
        year: vehicleData.year,
        make: vehicleData.make,
        model: vehicleData.model,
        trim: vehicleData.trim,
        style: vehicleData.style,
        engine: vehicleData.engine,
        transmission: vehicleData.transmission,
        drivetrain: vehicleData.drivetrain,
        fuel_type: vehicleData.fuel_type,
        made_in: vehicleData.made_in,
        msrp: vehicleData.msrp
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
  const claudeHealth = checkClaudeHealth();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    claude: claudeHealth
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

// Test endpoint that always uses mock responses
app.post('/api/test-valuation', async (req, res) => {
  try {
    const { vin } = req.body;
    
    // Validate VIN
    if (!isValidVIN(vin)) {
      return res.status(400).json({
        error: 'Invalid VIN',
        message: 'VIN must be exactly 17 characters and contain only valid characters'
      });
    }

    console.log(`🧪 Testing VIN: ${vin}`);

    // Check if we have a mock response for this VIN
    if (hasMockResponse(vin)) {
      const mockResponse = getMockResponse(vin);
      console.log('✅ Using mock response');
      return res.json(mockResponse);
    } else {
      return res.status(404).json({
        error: 'No test data available',
        message: `No mock response available for VIN: ${vin}`,
        available_test_vins: Object.keys(require('./test-responses').MOCK_RESPONSES)
      });
    }

  } catch (error) {
    console.error('Test API Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong processing your test request'
    });
  }
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