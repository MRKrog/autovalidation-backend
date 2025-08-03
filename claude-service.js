const Anthropic = require('@anthropic-ai/sdk');
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
const analyzeVehicleWithClaude = async (vehicleData) => {
  console.log('🧠 Generating vehicle analysis with Claude...');
  
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

    return analysis;
    
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