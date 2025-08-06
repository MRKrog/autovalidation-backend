const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { analyzeVehicleWithClaude, checkClaudeHealth } = require('./ai-services/claude-service');
const { analyzeVehicleWithGrok, checkGrokHealth } = require('./ai-services/grok-service');
const { getMockResponse, hasMockResponse } = require('./test-responses');
const { structureVehicleData, formatVehicleForResponse, formatEnhancedVehicleForResponse, isValidVehicleData, getVehicleIdentifier } = require('./utilities/vehicle-helpers');
const { isValidVIN, normalizeVIN, getSquishVIN, isValidCondition, normalizeCondition, generateReportId } = require('./utilities/vin-helpers');
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
    const { vin, condition, mileage } = req.body; // Add mileage to destructuring
    
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

    // STEP 1: Decode VIN (stays the same)
    const autoDevResponse = await axios.get(
      `https://auto.dev/api/vin/${vin}?apikey=${process.env.AUTO_DEV_API_KEY}`
    );
    
    const rawVehicleSpecs = autoDevResponse.data;
    const vehicleData = structureVehicleData(rawVehicleSpecs, vin);

    // STEP 2: Get AI Analysis
    let aiAnalysis;
    
    if (process.env.NODE_ENV === 'test' && hasMockResponse(vin)) {
      aiAnalysis = getMockResponse(vin, vehicleCondition).analysis;
    } else {
      const aiService = process.env.AI_SERVICE || 'claude';
      
      if (aiService === 'grok') {
        aiAnalysis = await analyzeVehicleWithGrok(vehicleData, vehicleCondition, null, actualMileage);
      } else {
        aiAnalysis = await analyzeVehicleWithClaude(vehicleData, vehicleCondition, null, actualMileage);
      }
    }

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
        make: vehicleData.make?.name || vehicleData.make,
        model: vehicleData.model?.name || vehicleData.model,
        trim: vehicleData.trim?.name || vehicleData.trim,
        style: vehicleData.style?.name || vehicleData.style,
        body_style: vehicleData.bodyStyle?.body,
        
        // Enhanced Specifications
        engine: {
          displacement: vehicleData.engine?.size || vehicleData.engine?.displacement,
          horsepower: vehicleData.engine?.horsepower,
          torque: vehicleData.engine?.torque,
          cylinders: vehicleData.engine?.cylinder || vehicleData.engine?.cylinders,
          configuration: vehicleData.engine?.configuration,
          fuel_type: vehicleData.engine?.fuelType,
          turbo: vehicleData.engine?.compressorType === 'turbocharger'
        },
        
        transmission: {
          type: vehicleData.transmission?.transmissionType,
          speeds: vehicleData.transmission?.numberOfSpeeds,
          name: vehicleData.transmission?.name
        },
        
        drivetrain: vehicleData.driveType || vehicleData.drivetrain,
        fuel_economy: vehicleData.fuelEconomy,
        doors: vehicleData.specifications?.doors,
        vehicle_size: vehicleData.specifications?.vehicleSize,
        epa_class: vehicleData.specifications?.epaClass,
        
        // Original MSRP Data
        original_pricing: {
          msrp: vehicleData.msrp || vehicleData.pricing?.baseMsrp,
          invoice: vehicleData.pricing?.baseInvoice,
          delivery_charges: vehicleData.pricing?.deliveryCharges
        }
      },

      // Valuation Input Parameters
      valuation_parameters: {
        condition: vehicleCondition,
        mileage: {
          actual: actualMileage,
          expected: vehicleData.year ? (2025 - vehicleData.year) * 12000 : null,
          status: actualMileage ? (
            actualMileage < ((2025 - vehicleData.year) * 12000) ? 'below_average' :
            actualMileage > ((2025 - vehicleData.year) * 12000) ? 'above_average' : 'average'
          ) : 'estimated',
          variance_percentage: actualMileage && vehicleData.year ? 
            Math.round((((2025 - vehicleData.year) * 12000 - actualMileage) / ((2025 - vehicleData.year) * 12000)) * 100) : null
        }
      },

      // Baseline Reference Data
      baseline_data: {
        source: 'auto.dev',
        retail_value: vehicleData.pricing?.usedTmvRetail,
        private_party_value: vehicleData.pricing?.usedPrivateParty,
        trade_in_value: vehicleData.pricing?.usedTradeIn,
        tmv_rating: vehicleData.pricing?.tmvRecommendedRating,
        data_quality: vehicleData.pricing?.estimateTmv ? 'estimated' : 'actual',
        note: 'Baseline values provided for reference - AI analysis provides enhanced accuracy'
      },

      // AI-Enhanced Valuation Analysis
      ai_valuation: {
        // Market Values with detailed breakdown
        market_values: aiAnalysis.market_values,
        
        // AI Reasoning and Analysis
        analysis: {
          primary_value_drivers: aiAnalysis.ai_reasoning?.primary_value_drivers,
          baseline_comparison: aiAnalysis.ai_reasoning?.baseline_analysis,
          market_position: aiAnalysis.ai_reasoning?.market_position,
          pricing_strategy: aiAnalysis.ai_reasoning?.pricing_strategy,
          ai_advantages: aiAnalysis.ai_reasoning?.key_differentiators
        },
        
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
          actualMileage ? `${Math.abs(Math.round((((2025 - vehicleData.year) * 12000 - actualMileage) / ((2025 - vehicleData.year) * 12000)) * 100))}% ${actualMileage < ((2025 - vehicleData.year) * 12000) ? 'below' : 'above'} average mileage` : 'Standard mileage assumed',
          `AI valuation ${aiAnalysis.market_values?.retail_value?.suggested_ai_price > vehicleData.pricing?.usedTmvRetail ? 'above' : 'below'} baseline by ${Math.abs(Math.round(((aiAnalysis.market_values?.retail_value?.suggested_ai_price - vehicleData.pricing?.usedTmvRetail) / vehicleData.pricing?.usedTmvRetail) * 100))}%`,
          aiAnalysis.ai_reasoning?.pricing_strategy?.toLowerCase().includes('aggressive') ? 'Aggressive pricing strategy' : 'Conservative pricing strategy'
        ],
        confidence_level: aiAnalysis.confidence_assessment?.valuation_accuracy || 'high'
      }
    };

    res.json(valuationReport);

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

// Enhanced valuation endpoint with market data (optional future feature)
app.post('/api/valuation/enhanced', async (req, res) => {
  try {
    const { vin, condition, includeMarketData } = req.body;
    
    // Validate VIN
    if (!isValidVIN(vin)) {
      return res.status(400).json({
        error: 'Invalid VIN',
        message: 'VIN must be exactly 17 characters and contain only valid characters'
      });
    }

    if (condition && !isValidCondition(condition)) {
      return res.status(400).json({
        error: 'Invalid condition',
        message: 'Condition must be one of: excellent, good, fair, poor'
      });
    }

    const vehicleCondition = normalizeCondition(condition);

    // STEP 1: Decode VIN
    const autoDevResponse = await axios.get(
      `https://auto.dev/api/vin/${vin}?apikey=${process.env.AUTO_DEV_API_KEY}`
    );

    const rawVehicleSpecs = autoDevResponse.data;
    
    if (!rawVehicleSpecs || rawVehicleSpecs.error) {
      return res.status(404).json({
        error: 'VIN not found',
        message: 'Unable to decode VIN. Please verify the VIN is correct.'
      });
    }

    // Structure vehicle data for enhanced analysis
    const vehicleData = structureVehicleData(rawVehicleSpecs);

    // Step 2: Optionally fetch market data (future enhancement)
    let marketData = null;
    if (includeMarketData) {
      // This could integrate with market data APIs in the future
      // marketData = await getMarketContext(vehicleData.year, vehicleData.make.name, vehicleData.model.name);
      console.log('📊 Market data integration not yet implemented');
    }

    // Step 3: Enhanced AI analysis
    const aiService = process.env.AI_SERVICE || 'claude';
    let aiAnalysis;
    
    if (aiService.toLowerCase() === 'grok') {
      console.log('🤖 Using Enhanced Grok AI with market context');
      aiAnalysis = await analyzeVehicleWithGrok(vehicleData, vehicleCondition, marketData);
    } else {
      console.log('🧠 Using Claude AI for enhanced analysis');
      aiAnalysis = await analyzeVehicleWithClaude(vehicleData, vehicleCondition);
    }

    // Step 4: Structure enhanced response
    const enhancedValuationReport = {
      success: true,
      timestamp: new Date().toISOString(),
      vin: vin.toUpperCase(),
      vehicle: {
        year: vehicleData.year,
        make: vehicleData.make?.name || vehicleData.make,
        model: vehicleData.model?.name || vehicleData.model,
        trim: vehicleData.trim?.name || vehicleData.trim,
        style: vehicleData.style?.name || vehicleData.style,
        engine_specs: vehicleData.engine,
        transmission_specs: vehicleData.transmission,
        drivetrain: vehicleData.drivenWheels || vehicleData.drivetrain,
        fuel_economy: vehicleData.mpg,
        categories: vehicleData.categories,
        options: vehicleData.options,
        colors: vehicleData.colors,
        made_in: vehicleData.made_in,
        msrp: vehicleData.msrp
      },
      condition: vehicleCondition,
      analysis: aiAnalysis,
      market_data: marketData,
      report_id: `VVP-ENH-${Date.now()}`,
      generated_by: 'VinValuation Pro API v1.1 (Enhanced Premium)'
    };

    res.json(enhancedValuationReport);

  } catch (error) {
    console.error('Enhanced API Error:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'External API Error',
        message: 'Unable to process enhanced request. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong processing your enhanced request',
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
        vin: 'JF1GR8H6XBL831881',
        description: '2011 Subaru Impreza WRX STI (Low Mileage Performance)'
      }
    ]
  });
});

// Test endpoint that always uses mock responses
app.post('/api/test-valuation', async (req, res) => {
  try {
    const { vin, condition } = req.body;
    
    // Validate VIN
    if (!isValidVIN(vin)) {
      return res.status(400).json({
        error: 'Invalid VIN',
        message: 'VIN must be exactly 17 characters and contain only valid characters'
      });
    }

    // Validate condition (optional but if provided, must be valid)
    const validConditions = ['excellent', 'good', 'fair', 'poor'];
    if (condition && !validConditions.includes(condition.toLowerCase())) {
      return res.status(400).json({
        error: 'Invalid condition',
        message: 'Condition must be one of: excellent, good, fair, poor'
      });
    }

    const vehicleCondition = condition ? condition.toLowerCase() : 'good'; // Default to good if not provided

    console.log(`🧪 Testing VIN: ${vin} with condition: ${vehicleCondition}`);

    // Check if we have a mock response for this VIN
    if (hasMockResponse(vin)) {
      const mockResponse = getMockResponse(vin, vehicleCondition);
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