const axios = require('axios');
const { buildEnhancedReasoningPrompt, buildVehicleValuationPrompt, validateAIValuation } = require('./ai-prompts');
const { SimpleTokenCounter } = require('./pricing/estimate-prompt-cost');
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
const analyzeVehicleWithGrok = async (vehicleData, condition = 'good', marketData = null, actualMileage = null) => {
  console.log(`🧠 Generating enhanced vehicle analysis with Grok for condition:`);
  
  try {
    const prompt = buildEnhancedReasoningPrompt(vehicleData, condition, marketData, actualMileage);
    // const prompt = buildEnhancedVehicleValuationPrompt(vehicleData, condition, marketData);

    // grok-mini, grok-3, grok-4
    const model = 'grok-4';
    // const model = 'grok-3-mini';

    // console.log('prompt', prompt);

    SimpleTokenCounter.estimateCost(model, prompt); // Estimate cost before making request

    // Grok API call
    const response = await axios.post('https://api.x.ai/v1/chat/completions', {
      model: model,
      messages: [{
        role: 'system',
        content: 'You are a professional automotive appraiser. Provide accurate, realistic vehicle valuations based on current market conditions. Always respond with valid JSON in the exact format requested.'
      }, {
        role: 'user',
        content: prompt
      }],
      max_tokens: 4000,
      temperature: 0.3 // Temperature controls AI response randomness: 0.0 = Most deterministic, consistent responses || 1.0 = Most creative, varied responses ||0.3 = Balanced approach - consistent but with some flexibility
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const analysis = response.data?.choices?.[0]?.message?.content;
    console.log(`📝 Enhanced analysis generated: ${analysis?.length || 0} characters`);

    // 🎯 LOG TOKEN USAGE AND COST HERE
    const vehicleInfo = `${vehicleData.year} ${vehicleData.make?.name} ${vehicleData.model?.name}${actualMileage ? ` (${actualMileage.toLocaleString()} mi)` : ''}`;

    SimpleTokenCounter.logTokenUsage(model, prompt, analysis, {
      vehicleInfo: vehicleInfo,
      condition: condition,
      hasActualMileage: actualMileage !== null,
      requestType: 'vehicle_valuation'
    });

    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = analysis.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedAnalysis = JSON.parse(jsonMatch[0]);
        console.log('✅ Successfully parsed enhanced structured analysis');
        
        // Validate the AI-generated valuation
        const validation = validateAIValuation(parsedAnalysis, vehicleData, marketData);
        console.log('🔍 Validation:', validation);
        
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
  analyzeVehicleWithGrok,
  checkGrokHealth
};