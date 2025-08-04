const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { analyzeVehicleWithClaude, checkClaudeHealth } = require('./claude-service');
const { analyzeVehicleWithGrok, checkGrokHealth } = require('./grok-service');
const { getMockResponse, hasMockResponse } = require('./test-responses');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// VIN validation helper
const isValidVIN = (vin) => {
  return vin && vin.length === 17 && /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
};

// Helper function to structure vehicle data for enhanced analysis
const structureVehicleData = (rawVehicleSpecs) => {
  return {
    // Basic info
    years: rawVehicleSpecs.years || [{ year: rawVehicleSpecs.year }],
    make: rawVehicleSpecs.make || { name: rawVehicleSpecs.make },
    model: rawVehicleSpecs.model || { name: rawVehicleSpecs.model },
    
    // Detailed specs for enhanced analysis
    engine: rawVehicleSpecs.engine || {},
    transmission: rawVehicleSpecs.transmission || {},
    drivenWheels: rawVehicleSpecs.drivenWheels || rawVehicleSpecs.drivetrain,
    categories: rawVehicleSpecs.categories || {},
    mpg: rawVehicleSpecs.mpg || {},
    squishVin: rawVehicleSpecs.squishVin || vin.substring(0, 11),
    options: rawVehicleSpecs.options || [],
    colors: rawVehicleSpecs.colors || [],
    
    // Fallback to basic structure for compatibility
    year: rawVehicleSpecs.year || rawVehicleSpecs.years?.[0]?.year,
    trim: rawVehicleSpecs.trim?.name || rawVehicleSpecs.trim,
    style: rawVehicleSpecs.style?.name || rawVehicleSpecs.style,
    fuel_type: rawVehicleSpecs.fuel_type?.name || rawVehicleSpecs.fuel_type,
    made_in: rawVehicleSpecs.made_in || 'Unknown',
    msrp: rawVehicleSpecs.msrp || 'Unknown'
  };
};

// Main VIN valuation endpoint
app.post('/api/valuation', async (req, res) => {
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

    console.log(`Processing VIN: ${vin} with condition: ${vehicleCondition}`);

    // Step 1: Decode VIN using auto.dev API
    const autoDevResponse = await axios.get(
      `https://auto.dev/api/vin/${vin}?apikey=${process.env.AUTO_DEV_API_KEY}`
    );

    const rawVehicleSpecs = autoDevResponse.data;
    
    // Check if VIN was successfully decoded
    if (!rawVehicleSpecs || rawVehicleSpecs.error) {
      return res.status(404).json({
        error: 'VIN not found',
        message: 'Unable to decode VIN. Please verify the VIN is correct.'
      });
    }

    // Structure vehicle data for enhanced analysis
    const vehicleData = structureVehicleData(rawVehicleSpecs);

    console.log('Vehicle decoded successfully:', vehicleData.year, vehicleData.make?.name || vehicleData.make, vehicleData.model?.name || vehicleData.model);

    // Step 2: Analyze with AI (Claude or Grok) or use mock response in test mode
    let aiAnalysis;
    
    // Check if we're in test mode and have a mock response
    if (process.env.NODE_ENV === 'test' && hasMockResponse(vin)) {
      console.log('🧪 Using mock response for testing');
      const mockResponse = getMockResponse(vin, vehicleCondition);
      aiAnalysis = mockResponse.analysis;
    } else {
      // Choose AI service based on environment variable
      const aiService = process.env.AI_SERVICE || 'claude'; // Default to Claude
      
      if (aiService.toLowerCase() === 'grok') {
        console.log('🤖 Using Enhanced Grok AI for analysis');
        // Pass the structured vehicle data to the enhanced Grok function
        aiAnalysis = await analyzeVehicleWithGrok(vehicleData, vehicleCondition);
      } else {
        console.log('🧠 Using Claude AI for analysis');
        aiAnalysis = await analyzeVehicleWithClaude(vehicleData, vehicleCondition);
      }
    }

    // Step 3: Structure the response
    const valuationReport = {
      success: true,
      timestamp: new Date().toISOString(),
      vin: vin.toUpperCase(),
      vehicle: {
        year: vehicleData.year,
        make: vehicleData.make?.name || vehicleData.make,
        model: vehicleData.model?.name || vehicleData.model,
        trim: vehicleData.trim?.name || vehicleData.trim,
        style: vehicleData.style?.name || vehicleData.style,
        engine: vehicleData.engine?.name || vehicleData.engine,
        transmission: vehicleData.transmission?.name || vehicleData.transmission,
        drivetrain: vehicleData.drivenWheels || vehicleData.drivetrain,
        fuel_type: vehicleData.fuel_type,
        made_in: vehicleData.made_in,
        msrp: vehicleData.msrp,
        // Add enhanced specs to response
        engine_specs: vehicleData.engine,
        mpg: vehicleData.mpg,
        categories: vehicleData.categories
      },
      condition: vehicleCondition,
      analysis: aiAnalysis, // Enhanced analysis with validation
      report_id: `VVP-${Date.now()}`,
      generated_by: 'VinValuation Pro API v1.1 (Enhanced)'
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

    const validConditions = ['excellent', 'good', 'fair', 'poor'];
    if (condition && !validConditions.includes(condition.toLowerCase())) {
      return res.status(400).json({
        error: 'Invalid condition',
        message: 'Condition must be one of: excellent, good, fair, poor'
      });
    }

    const vehicleCondition = condition ? condition.toLowerCase() : 'good';

    console.log(`Processing enhanced VIN: ${vin} with condition: ${vehicleCondition}`);

    // Step 1: Decode VIN
    const autoDevResponse = await axios.get(
      `https://auto.dev/api/vin/${vin}?apikey=${process.env.AUTO_DEV_API_KEY}`
    );

    console.log('🔍 AutoDev response:', autoDevResponse.data);

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
  const { vin } = req.body;
    // Step 1: Decode VIN
    const autoDevResponse = await axios.get(
      `https://auto.dev/api/vin/${vin}?apikey=${process.env.AUTO_DEV_API_KEY}`
    );
    res.json(autoDevResponse.data);
    console.log('🔍 AutoDev response:', autoDevResponse.data);
    return res.json(autoDevResponse.data);
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

// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const { analyzeVehicleWithClaude, checkClaudeHealth } = require('./claude-service');
// const { analyzeVehicleWithGrok, checkGrokHealth } = require('./grok-service');
// const { getMockResponse, hasMockResponse } = require('./test-responses');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // VIN validation helper
// const isValidVIN = (vin) => {
//   return vin && vin.length === 17 && /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
// };



// // Main VIN valuation endpoint
// app.post('/api/valuation', async (req, res) => {
//   try {
//     const { vin, condition } = req.body;
    
//     // Validate VIN
//     if (!isValidVIN(vin)) {
//       return res.status(400).json({
//         error: 'Invalid VIN',
//         message: 'VIN must be exactly 17 characters and contain only valid characters'
//       });
//     }

//     // Validate condition (optional but if provided, must be valid)
//     const validConditions = ['excellent', 'good', 'fair', 'poor'];
//     if (condition && !validConditions.includes(condition.toLowerCase())) {
//       return res.status(400).json({
//         error: 'Invalid condition',
//         message: 'Condition must be one of: excellent, good, fair, poor'
//       });
//     }

//     const vehicleCondition = condition ? condition.toLowerCase() : 'good'; // Default to good if not provided

//     console.log(`Processing VIN: ${vin}`);

//     // Step 1: Decode VIN using auto.dev API
//     const autoDevResponse = await axios.get(
//       `https://auto.dev/api/vin/${vin}?apikey=${process.env.AUTO_DEV_API_KEY}`
//     );

//     const vehicleSpecs = autoDevResponse.data;
    
//     // Check if VIN was successfully decoded
//     if (!vehicleSpecs || vehicleSpecs.error) {
//       return res.status(404).json({
//         error: 'VIN not found',
//         message: 'Unable to decode VIN. Please verify the VIN is correct.'
//       });
//     }

//     // Handle different response formats from auto.dev API
//     const vehicleData = {
//       year: vehicleSpecs.year || vehicleSpecs.years?.[0]?.year,
//       make: vehicleSpecs.make?.name || vehicleSpecs.make,
//       model: vehicleSpecs.model?.name || vehicleSpecs.model,
//       trim: vehicleSpecs.trim?.name || vehicleSpecs.trim,
//       style: vehicleSpecs.style?.name || vehicleSpecs.style,
//       engine: vehicleSpecs.engine?.name || vehicleSpecs.engine,
//       transmission: vehicleSpecs.transmission?.name || vehicleSpecs.transmission,
//       drivetrain: vehicleSpecs.drivetrain?.name || vehicleSpecs.drivetrain,
//       fuel_type: vehicleSpecs.fuel_type?.name || vehicleSpecs.fuel_type,
//       made_in: vehicleSpecs.made_in || 'Unknown',
//       msrp: vehicleSpecs.msrp || 'Unknown'
//     };

//     console.log('Vehicle decoded successfully:', vehicleData.year, vehicleData.make, vehicleData.model);

//     // Step 2: Analyze with AI (Claude or Grok) or use mock response in test mode
//     let aiAnalysis;
    
//     // Check if we're in test mode and have a mock response
//     if (process.env.NODE_ENV === 'test' && hasMockResponse(vin)) {
//       console.log('🧪 Using mock response for testing');
//       const mockResponse = getMockResponse(vin, vehicleCondition);
//       aiAnalysis = mockResponse.analysis;
//     } else {
//       // Choose AI service based on environment variable
//       const aiService = process.env.AI_SERVICE || 'claude'; // Default to Claude
      
//       if (aiService.toLowerCase() === 'grok') {
//         console.log('🤖 Using Grok AI for analysis');
//         aiAnalysis = await analyzeVehicleWithGrok(vehicleData, vehicleCondition);
//       } else {
//         console.log('🧠 Using Claude AI for analysis');
//         aiAnalysis = await analyzeVehicleWithClaude(vehicleData, vehicleCondition);
//       }
//     }

//     // Step 3: Structure the response
//     const valuationReport = {
//       success: true,
//       timestamp: new Date().toISOString(),
//       vin: vin.toUpperCase(),
//       vehicle: {
//         year: vehicleData.year,
//         make: vehicleData.make,
//         model: vehicleData.model,
//         trim: vehicleData.trim,
//         style: vehicleData.style,
//         engine: vehicleData.engine,
//         transmission: vehicleData.transmission,
//         drivetrain: vehicleData.drivetrain,
//         fuel_type: vehicleData.fuel_type,
//         made_in: vehicleData.made_in,
//         msrp: vehicleData.msrp
//       },
//       condition: vehicleCondition,
//       analysis: aiAnalysis, // This will be either structured JSON or raw text
//       report_id: `VVP-${Date.now()}`,
//       generated_by: 'VinValuation Pro API v1.0'
//     };

//     res.json(valuationReport);

//   } catch (error) {
//     console.error('API Error:', error);
    
//     if (error.response) {
//       // External API error
//       return res.status(error.response.status).json({
//         error: 'External API Error',
//         message: 'Unable to process request. Please try again later.',
//         details: process.env.NODE_ENV === 'development' ? error.message : undefined
//       });
//     }
    
//     // Internal server error
//     res.status(500).json({
//       error: 'Internal Server Error',
//       message: 'Something went wrong processing your request',
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   const claudeHealth = checkClaudeHealth();
//   const grokHealth = checkGrokHealth();
//   const aiService = process.env.AI_SERVICE || 'claude';
  
//   res.json({
//     status: 'healthy',
//     timestamp: new Date().toISOString(),
//     version: '1.0.0',
//     ai_service: aiService,
//     claude: claudeHealth,
//     grok: grokHealth
//   });
// });

// // VIN validation endpoint (free check)
// app.post('/api/validate-vin', (req, res) => {
//   const { vin } = req.body;
  
//   const isValid = isValidVIN(vin);
  
//   res.json({
//     vin: vin?.toUpperCase(),
//     valid: isValid,
//     message: isValid ? 'Valid VIN format' : 'Invalid VIN format'
//   });
// });

// // Sample VINs endpoint for testing
// app.get('/api/sample-vins', (req, res) => {
//   res.json({
//     sample_vins: [
//       {
//         vin: '1G1ZD5ST8JF134138',
//         description: '2018 Chevrolet Malibu'
//       },
//       {
//         vin: '1HGBH41JXMN109186',
//         description: '2021 Honda Civic'
//       },
//       {
//         vin: '1FTFW1ET5DFC10312',
//         description: '2013 Ford F-150'
//       }
//     ]
//   });
// });

// // Test endpoint that always uses mock responses
// app.post('/api/test-valuation', async (req, res) => {
//   try {
//     const { vin, condition } = req.body;
    
//     // Validate VIN
//     if (!isValidVIN(vin)) {
//       return res.status(400).json({
//         error: 'Invalid VIN',
//         message: 'VIN must be exactly 17 characters and contain only valid characters'
//       });
//     }

//     // Validate condition (optional but if provided, must be valid)
//     const validConditions = ['excellent', 'good', 'fair', 'poor'];
//     if (condition && !validConditions.includes(condition.toLowerCase())) {
//       return res.status(400).json({
//         error: 'Invalid condition',
//         message: 'Condition must be one of: excellent, good, fair, poor'
//       });
//     }

//     const vehicleCondition = condition ? condition.toLowerCase() : 'good'; // Default to good if not provided

//     console.log(`🧪 Testing VIN: ${vin} with condition: ${vehicleCondition}`);

//     // Check if we have a mock response for this VIN
//     if (hasMockResponse(vin)) {
//       const mockResponse = getMockResponse(vin, vehicleCondition);
//       console.log('✅ Using mock response');
//       return res.json(mockResponse);
//     } else {
//       return res.status(404).json({
//         error: 'No test data available',
//         message: `No mock response available for VIN: ${vin}`,
//         available_test_vins: Object.keys(require('./test-responses').MOCK_RESPONSES)
//       });
//     }

//   } catch (error) {
//     console.error('Test API Error:', error);
//     res.status(500).json({
//       error: 'Internal Server Error',
//       message: 'Something went wrong processing your test request'
//     });
//   }
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err);
//   res.status(500).json({
//     error: 'Internal Server Error',
//     message: 'An unexpected error occurred'
//   });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     error: 'Not Found',
//     message: 'The requested endpoint does not exist'
//   });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚗 VinValuation API running on port ${PORT}`);
//   console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
//   console.log(`🔍 Main endpoint: POST http://localhost:${PORT}/api/valuation`);
  
//   // Verify environment variables
//   if (!process.env.AUTO_DEV_API_KEY) {
//     console.warn('⚠️  AUTO_DEV_API_KEY not set');
//   }
//   if (!process.env.CLAUDE_API_KEY) {
//     console.warn('⚠️  CLAUDE_API_KEY not set');
//   }
// });

// module.exports = app;