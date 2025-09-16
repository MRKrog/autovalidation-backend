const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { analyzeVehicleWithAutoDev } = require('./services/auto-dev-service');
const { analyzeVehicleWithClaude, checkClaudeHealth } = require('./services/claude-service');
const { analyzeVehicleWithGrok, checkGrokHealth } = require('./services/grok-service');
const { getMockResponse } = require('./testing/test-responses');
const { isValidVIN, isValidCondition, normalizeCondition } = require('./utilities/vin-helpers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// *********************************************************************************
// Main VIN valuation endpoint
// *********************************************************************************
app.post('/api/valuation', async (req, res) => {
  try {
    const { vin, condition, mileage, isTest } = req.body; // Add mileage to destructuring
    console.log('🧪 isTest value:', isTest);
    // Validate VIN
    if (!isValidVIN(vin)) {
      return res.status(400).json({
        error: 'Invalid VIN',
        message: 'VIN must be exactly 17 characters and contain only valid characters'
      });
    }

    // Validate condition (optional but if provided, must be valid)
    if (condition && !isValidCondition(condition)) {
      return res.status(400).json({
        error: 'Invalid condition',
        message: 'Condition must be one of: excellent, good, fair, poor'
      });
    }

    // Validate mileage (optional but if provided, must be reasonable)
    if (mileage !== undefined) {
      const parsedMileage = parseInt(mileage);
      if (isNaN(parsedMileage) || parsedMileage < 0 || parsedMileage > 1000000) {
        return res.status(400).json({
          error: 'Invalid mileage',
          message: 'Mileage must be a number between 0 and 1,000,000'
        });
      }
    }

    const vehicleCondition = normalizeCondition(condition);
    const actualMileage = mileage ? parseInt(mileage) : null;

    if (isTest) {
      console.log('🧪 TESTING VIN NUMBER: ', vin);
      const delay = 5000;
      
      // Create a promise that resolves after the delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      const mockResponse = getMockResponse(vin, vehicleCondition);
      return res.json(mockResponse);
    }
    
    console.log('🚨 This should NOT run if isTest is true!');
    
    // STEP 1: Decode VIN (stays the same)
    const vehicleData = await analyzeVehicleWithAutoDev(vin);

    // STEP 2: Get AI Analysis
    const aiService = process.env.AI_SERVICE || 'claude';
    let aiAnalysis;
    
    if (aiService === 'grok') {
      aiAnalysis = await analyzeVehicleWithGrok(vehicleData, vehicleCondition, null, actualMileage);
    } else {
      aiAnalysis = await analyzeVehicleWithClaude(vehicleData, vehicleCondition, null, actualMileage);
    }

    console.log('🔍 AI Analysis:', aiAnalysis);
    
    // STEP 3: Build Enhanced Response Structure
    const valuationReport = {
      success: true,
      timestamp: new Date().toISOString(),
      report_id: `DVai-${Date.now()}`,
      generated_by: 'DriveValueAI API v2.0',
      
      // Vehicle Information
      vehicle: {
        vin: vin.toUpperCase(), 
        year: vehicleData.year,
        make: vehicleData.make?.name,
        model: vehicleData.model?.name,
        trim: vehicleData.trim,
        body_style: vehicleData.bodyStyle?.body,
        
        // Vehicle Characteristics
        vehicle_type: vehicleData.specifications?.type,
        origin: vehicleData.specifications?.origin,
        full_style: vehicleData.fullStyleDescription,
        
        // VIN Validation Data
        vin_validation: {
          valid: vehicleData.metadata?.vinValid,
          check_digit: vehicleData.metadata?.checkDigit,
          checksum: vehicleData.metadata?.checksum,
          wmi: vehicleData.metadata?.manufacturerCode,
          squish_vin: vehicleData.metadata?.squishVin
        },
        
        // Manufacturer Information
        manufacturer: vehicleData.metadata?.manufacturer
      },

      // Valuation Input Parameters
      valuation_parameters: {
        condition: vehicleCondition,
        mileage: {
          actual: actualMileage,
          expected: vehicleData.year ? (2025 - vehicleData.year) * 13500 : null,
          status: actualMileage ? (
            actualMileage < ((2025 - vehicleData.year) * 13500) ? 'below_average' :
            actualMileage > ((2025 - vehicleData.year) * 13500) ? 'above_average' : 'average'
          ) : 'estimated',
          variance_percentage: actualMileage && vehicleData.year ? 
            Math.round((((2025 - vehicleData.year) * 13500 - actualMileage) / ((2025 - vehicleData.year) * 13500)) * 100) : null
        }
      },

      // AI-Enhanced Valuation Analysis
      ai_valuation: {
        // Market Values with detailed breakdown
        market_values: aiAnalysis.market_values,
        
        // AI Reasoning and Analysis
        analysis: {
          primary_value_drivers: aiAnalysis.ai_reasoning?.primary_value_drivers,
          market_position: aiAnalysis.ai_reasoning?.market_position,
          pricing_strategy: aiAnalysis.ai_reasoning?.pricing_strategy,
          ai_advantages: aiAnalysis.ai_reasoning?.key_differentiators // dont really need this
        },
        
        // Key Insights
        key_insights: aiAnalysis.key_insights,
        
        // Detailed Adjustments
        value_adjustments: aiAnalysis.detailed_adjustments,
        
        // Performance & Technical Analysis
        performance_assessment: aiAnalysis.performance_factors,
        
        // Market Intelligence
        market_intelligence: aiAnalysis.market_analysis,
        
        // Risk Assessment
        risk_analysis: aiAnalysis.risk_factors,
        
        // Professional Recommendations
        recommendations: aiAnalysis.recommendations,
        
        // AI Confidence & Validation
        confidence_metrics: {
          overall_confidence: aiAnalysis.confidence_assessment,
          validation_results: aiAnalysis.validation || {
            is_valid: true,
            confidence: 'high',
            warnings: [],
            errors: []
          }
        }
      },

      // Quick Summary for UI Display
      summary: {
        recommended_price: {
          retail: aiAnalysis.market_values?.retail_value?.suggested_ai_price,
          private_party: aiAnalysis.market_values?.private_party_value?.suggested_ai_price,
          trade_in: aiAnalysis.market_values?.trade_in_value?.suggested_ai_price
        },
        key_highlights: [
          actualMileage ? `${Math.abs(Math.round((((2025 - vehicleData.year) * 13500 - actualMileage) / ((2025 - vehicleData.year) * 13500)) * 100))}% ${actualMileage < ((2025 - vehicleData.year) * 13500) ? 'below' : 'above'} average mileage` : 'Standard mileage assumed',
          `AI-powered valuation based on comprehensive market analysis`,
          aiAnalysis.ai_reasoning?.pricing_strategy?.toLowerCase().includes('aggressive') ? 'Aggressive pricing strategy' : 'Conservative pricing strategy'
        ],
        confidence_level: aiAnalysis.confidence_assessment?.valuation_accuracy || 'high'
      }
    };

    return res.json(valuationReport);

  } catch (error) {
    console.error('API Error:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'External API Error',
        message: 'Unable to process request. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
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
  const grokHealth = checkGrokHealth();
  const aiService = process.env.AI_SERVICE || 'claude';
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.1.0',
    ai_service: aiService,
    enhanced_prompts: true,
    validation_enabled: true,
    claude: claudeHealth,
    grok: grokHealth
  });
});

// Auto.dev API endpoint solo for testing
app.post('/api/auto-dev', async (req, res) => {
  try {
    const { vin } = req.body;
    
    // TODO: ADD Another auto dev api key and use it here - Switch between keys
    // Step 1: Decode VIN
    const autoDevResponse = await axios.get(
      `https://auto.dev/api/vin/${vin}?apikey=${process.env.AUTO_DEV_API_KEY}`
    );

    return res.json(autoDevResponse.data);
  } catch (error) {
    console.error('Auto.dev API Error:', error);
    return res.status(500).json({
      error: 'Auto.dev API Error',
      message: 'Unable to fetch vehicle data from auto.dev'
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
  console.log(`⚡ Enhanced endpoint: POST http://localhost:${PORT}/api/valuation/enhanced`);
  
  // Verify environment variables
  if (!process.env.AUTO_DEV_API_KEY) {
    console.warn('⚠️  AUTO_DEV_API_KEY not set');
  }
  if (!process.env.CLAUDE_API_KEY) {
    console.warn('⚠️  CLAUDE_API_KEY not set');
  }
  if (!process.env.GROK_API_KEY) {
    console.warn('⚠️  GROK_API_KEY not set');
  }
});

module.exports = app;