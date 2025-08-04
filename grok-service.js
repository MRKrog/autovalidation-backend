const axios = require('axios');
const { buildEnhancedVehicleValuationPrompt, validateAIValuation } = require('./ai-prompts');
require('dotenv').config(); // Ensure dotenv is loaded

// Initialize Grok API configuration
const grokApiKey = process.env.GROK_API_KEY?.trim();
console.log('🔑 Grok API Key check:', {
  hasKey: !!grokApiKey,
  keyLength: grokApiKey?.length || 0,
  keyStart: grokApiKey?.substring(0, 15) + '...',
  keyEnd: grokApiKey?.substring(-15) || 'N/A'
});

if (!grokApiKey) {
  console.warn('⚠️ GROK_API_KEY environment variable is not set');
}

// Enhanced Grok API integration with validation
const analyzeVehicleWithGrok = async (vehicleData, condition = 'good', marketData = null) => {
  console.log(`🧠 Generating enhanced vehicle analysis with Grok for condition: ${condition}...`);
  
  try {
    // Use the enhanced prompt instead of basic one
    const prompt = buildEnhancedVehicleValuationPrompt(vehicleData, condition, marketData);

    console.log('📝 Calling Grok API with enhanced prompt...');
    
    // Grok API endpoint and configuration
    const response = await axios.post('https://api.x.ai/v1/chat/completions', {
      model: 'grok-3', // Available models: grok-beta, grok-3-mini, grok-3, grok-4-0709
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 3000, // Increased for enhanced response
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📦 Grok API response received:', {
      hasContent: !!response.data?.choices,
      contentLength: response.data?.choices?.[0]?.message?.content?.length,
      hasUsage: !!response.data?.usage
    });

    const analysis = response.data?.choices?.[0]?.message?.content;
    console.log(`📝 Enhanced analysis generated: ${analysis?.length || 0} characters`);

    // Try to parse the JSON response
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = analysis.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedAnalysis = JSON.parse(jsonMatch[0]);
        console.log('✅ Successfully parsed enhanced structured analysis');
        
        // Validate the AI-generated valuation
        const validation = validateAIValuation(parsedAnalysis, vehicleData, marketData);
        
        // Add validation results to the response
        const enhancedResult = {
          ...parsedAnalysis,
          validation: {
            is_valid: validation.isValid,
            confidence: validation.confidence,
            warnings: validation.warnings,
            errors: validation.errors,
            ...(validation.adjustments && { suggested_adjustments: validation.adjustments })
          }
        };
        
        if (validation.warnings.length > 0) {
          console.log('⚠️ Validation warnings:', validation.warnings);
        }
        
        if (validation.errors.length > 0) {
          console.log('❌ Validation errors:', validation.errors);
        }
        
        return enhancedResult;
      } else {
        console.log('⚠️ No JSON found in enhanced response, returning raw text');
        return analysis;
      }
    } catch (parseError) {
      console.log('⚠️ Failed to parse enhanced JSON, returning raw text:', parseError.message);
      return analysis;
    }
    
  } catch (error) {
    console.error('❌ Enhanced Grok API error:', error);
    
    // Handle specific Grok API errors
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded - too many requests to Grok');
    } else if (error.response?.status === 401) {
      throw new Error('Invalid Grok API key');
    } else if (error.response?.status === 400) {
      throw new Error('Invalid request to Grok API');
    } else {
      throw new Error(`Enhanced Grok generation failed: ${error.message}`);
    }
  }
};

// Optional: Keep the basic version as a fallback
const analyzeVehicleWithGrokBasic = async (vehicleData, condition = 'good') => {
  console.log(`🧠 Generating basic vehicle analysis with Grok for condition: ${condition}...`);
  
  try {
    const { buildVehicleValuationPrompt } = require('./ai-prompts');
    const prompt = buildVehicleValuationPrompt(vehicleData, condition);

    console.log('📝 Calling Grok API with basic prompt...');
    
    const response = await axios.post('https://api.x.ai/v1/chat/completions', {
      model: 'grok-3',
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 2000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const analysis = response.data?.choices?.[0]?.message?.content;
    
    try {
      const jsonMatch = analysis.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        return analysis;
      }
    } catch (parseError) {
      return analysis;
    }
    
  } catch (error) {
    console.error('❌ Basic Grok API error:', error);
    throw new Error(`Basic Grok generation failed: ${error.message}`);
  }
};

// Health check for Grok service
const checkGrokHealth = () => {
  return {
    apiKeyConfigured: !!process.env.GROK_API_KEY,
    grokInitialized: !!grokApiKey,
    enhancedPromptAvailable: true,
    validationEnabled: true,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  analyzeVehicleWithGrok, // Now uses enhanced prompt by default
  analyzeVehicleWithGrokBasic, // Fallback to basic prompt if needed
  checkGrokHealth
};