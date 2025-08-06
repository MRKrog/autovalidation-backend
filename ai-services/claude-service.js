const Anthropic = require('@anthropic-ai/sdk');
const { buildEnhancedReasoningPrompt, validateAIValuation } = require('../ai-prompts/ai-prompts');
const { SimpleTokenCounter } = require('../pricing/estimate-prompt-cost');

require('dotenv').config();

// Initialize Anthropic client
const apiKey = process.env.CLAUDE_API_KEY?.trim();
console.log('🔑 Claude API Key check:', {
  hasKey: !!apiKey,
  keyLength: apiKey?.length || 0,
  keyStart: apiKey?.substring(0, 15) + '...',
  keyEnd: apiKey?.substring(-15) || 'N/A'
});

if (!apiKey) {
  throw new Error('CLAUDE_API_KEY environment variable is not set');
}

const anthropic = new Anthropic({
  apiKey: apiKey
});

// Claude API integration
const analyzeVehicleWithClaude = async (vehicleData, condition = 'good', marketData = null, actualMileage = null) => {
  console.log(`🧠 Generating vehicle analysis with Claude for condition: ${condition}...`);
  
  try {
    const prompt = buildEnhancedReasoningPrompt(vehicleData, condition, marketData, actualMileage);
    
    // const model = 'claude-opus-4-1-20250805';
    // const model = 'claude-opus-4-20250514';
    // const model = 'claude-3-7-sonnet-20250219';
    // const model = 'claude-3-5-sonnet-20241022';
    const model = 'claude-3-haiku-20240307';

    SimpleTokenCounter.estimateCost(model, prompt);

    console.log('📝 Calling Claude API...');
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 4000, // Increased for detailed analysis
      temperature: 0.3, // Balanced approach - consistent but with some flexibility
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    console.log('📦 Claude API response received:', {
      hasContent: !!response.content,
      contentLength: response.content?.[0]?.text?.length,
      hasUsage: !!response.usage,
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens
    });

    const analysis = response.content[0].text;
    console.log(`📝 Enhanced analysis generated: ${analysis?.length || 0} characters`);

    // 🎯 LOG TOKEN USAGE AND COST HERE
    const vehicleInfo = `${vehicleData.year} ${vehicleData.make?.name} ${vehicleData.model?.name}${actualMileage ? ` (${actualMileage.toLocaleString()} mi)` : ''}`;

    SimpleTokenCounter.logTokenUsage(model, prompt, analysis, {
      vehicleInfo: vehicleInfo,
      condition: condition,
      hasActualMileage: actualMileage !== null,
      requestType: 'vehicle_valuation',
      actualInputTokens: response.usage?.input_tokens,
      actualOutputTokens: response.usage?.output_tokens
    });

    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = analysis.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedAnalysis = JSON.parse(jsonMatch[0]);
        console.log('✅ Successfully parsed structured analysis');
        
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
        console.log('⚠️ No JSON found in response, returning raw text');
        return analysis;
      }
    } catch (parseError) {
      console.log('⚠️ Failed to parse JSON, returning raw text:', parseError.message);
      return analysis;
    }
    
  } catch (error) {
    console.error('❌ Claude API error:', error);
    
    // Handle specific Claude API errors
    if (error.status === 429) {
      throw new Error('Rate limit exceeded - too many requests to Claude');
    } else if (error.status === 401) {
      throw new Error('Invalid Claude API key');
    } else if (error.status === 400) {
      throw new Error('Invalid request to Claude API');
    } else {
      throw new Error(`Claude generation failed: ${error.message}`);
    }
  }
};

// Health check for Claude service
const checkClaudeHealth = () => {
  return {
    apiKeyConfigured: !!process.env.CLAUDE_API_KEY,
    anthropicInitialized: !!anthropic,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  analyzeVehicleWithClaude,
  checkClaudeHealth
}; 