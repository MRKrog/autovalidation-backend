const Anthropic = require('@anthropic-ai/sdk');
const { buildVehicleValuationPrompt } = require('./ai-prompts');

require('dotenv').config(); // Ensure dotenv is loaded

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
const analyzeVehicleWithClaude = async (vehicleData, condition = 'good') => {
  console.log(`🧠 Generating vehicle analysis with Claude for condition: ${condition}...`);
  
  try {
    const prompt = buildVehicleValuationPrompt(vehicleData, condition);

    console.log('📝 Calling Claude API...');
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Using the cheaper model
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    console.log('📦 Claude API response received:', {
      hasContent: !!response.content,
      contentLength: response.content?.length,
      hasUsage: !!response.usage
    });

    const analysis = response.content[0].text;
    console.log(`📝 Analysis generated: ${analysis.length} characters`);

    // Try to parse the JSON response
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = analysis.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedAnalysis = JSON.parse(jsonMatch[0]);
        console.log('✅ Successfully parsed structured analysis');
        return parsedAnalysis;
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