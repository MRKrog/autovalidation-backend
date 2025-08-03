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
You are a professional automotive appraiser and market analyst. Analyze this vehicle and provide a comprehensive valuation report in JSON format.

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

Please provide a JSON response with the following structure:

{
  "market_values": {
    "retail_value": {
      "min": 13500,
      "max": 15200,
      "description": "Dealer lot price"
    },
    "private_party_value": {
      "min": 12000,
      "max": 13800,
      "description": "Individual seller price"
    },
    "trade_in_value": {
      "min": 10500,
      "max": 11900,
      "description": "Dealer trade value"
    }
  },
  "market_analysis": {
    "demand_level": "Medium",
    "price_trend": "Stable with slight upward trend",
    "regional_variations": "Coastal regions may see higher prices"
  },
  "key_factors": {
    "condition_impact": "Well-maintained vehicles command higher prices",
    "mileage_considerations": "Average 12,000 miles per year expected",
    "common_issues": "Minor recalls addressed by manufacturer",
    "resale_outlook": "40-50% value retention after 5 years"
  },
  "strategic_recommendations": {
    "best_time": "Current market is favorable",
    "negotiation_points": "Highlight maintenance and low mileage",
    "market_positioning": "Competitive against Accord and Camry"
  },
  "risk_assessment": {
    "reliability_concerns": "Generally reliable with few major issues",
    "depreciation_outlook": "Average depreciation rates",
    "market_saturation": "Balanced supply and demand"
  },
  "summary": {
    "overall_assessment": "Solid vehicle with stable market outlook",
    "recommended_action": "Good time to buy or sell",
    "confidence_level": "High"
  }
}

Provide specific dollar amounts based on current market conditions. Ensure all values are realistic for the ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}.
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