const axios = require('axios');
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

// Grok API integration
const analyzeVehicleWithGrok = async (vehicleData, condition = 'good') => {
  console.log(`🧠 Generating vehicle analysis with Grok for condition: ${condition}...`);
  
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
- Condition: ${condition} (excellent/good/fair/poor)

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

Provide specific dollar amounts based on current market conditions and the vehicle's ${condition} condition. 

Condition Impact Guidelines:
- Excellent: +10-15% above base value
- Good: Base market value (standard condition)
- Fair: -10-15% below base value
- Poor: -20-30% below base value

Ensure all values are realistic for the ${vehicleData.year} ${vehicleData.make} ${vehicleData.model} in ${condition} condition.
`;

    console.log('📝 Calling Grok API...');
    
    // Note: Replace with actual Grok API endpoint and format
    const response = await axios.post('https://api.grok.x.ai/v1/chat/completions', {
      model: 'grok-4-0709', // grok-3-mini // grok-3
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

    console.log('📦 Grok API response received:', {
      hasContent: !!response.data?.choices,
      contentLength: response.data?.choices?.[0]?.message?.content?.length,
      hasUsage: !!response.data?.usage
    });

    const analysis = response.data?.choices?.[0]?.message?.content;
    console.log(`📝 Analysis generated: ${analysis?.length || 0} characters`);

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
    console.error('❌ Grok API error:', error);
    
    // Handle specific Grok API errors
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded - too many requests to Grok');
    } else if (error.response?.status === 401) {
      throw new Error('Invalid Grok API key');
    } else if (error.response?.status === 400) {
      throw new Error('Invalid request to Grok API');
    } else {
      throw new Error(`Grok generation failed: ${error.message}`);
    }
  }
};

// Health check for Grok service
const checkGrokHealth = () => {
  return {
    apiKeyConfigured: !!process.env.GROK_API_KEY,
    grokInitialized: !!grokApiKey,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  analyzeVehicleWithGrok,
  checkGrokHealth
}; 