// ai-prompts/ai-prompt-9-16.js // UPDATED WITH NEW AUTO.DEV API STRUCTURE
const { determineMileageInfo, safeExtract } = require('../utilities/prompt-helpers');

const buildEnhancedReasoningPrompt = (vehicleData, condition = 'good', marketData = null, actualMileage = null) => {
  console.log('🔍 Analyzing vehicle with enhanced reasoning prompt...');
  console.log('🔍 STRUCTURED Vehicle data:', vehicleData);
  console.log('🔍 Actual mileage:', actualMileage);

  // Core data extraction with defaults
  const year = safeExtract(vehicleData, 'year'); // GOOD
  const make = safeExtract(vehicleData, 'make.name'); // GOOD
  const model = safeExtract(vehicleData, 'model.name'); // GOOD
  const trim = safeExtract(vehicleData, 'trim'); // GOOD
  const bodyStyle = safeExtract(vehicleData, 'bodyStyle.body'); // GOOD
  const vehicleType = safeExtract(vehicleData, 'specifications.type'); // GOOD
  const vehicleAge = year ? 2025 - year : 'Unknown'; // GOOD
  const expectedMileage = year ? vehicleAge * 13500 : 'Unknown'; // Updated to more accurate industry average of 13,500 miles/year // GOOD
  const mileageInfo = determineMileageInfo(actualMileage, expectedMileage); // GOOD

  return `
You are an AI-powered automotive appraiser for DriveValueAI. Provide accurate valuations using your comprehensive market analysis, 2025 trends, and tools for real-time data.

VEHICLE SPECIFICATIONS:
- Year: ${year}
- Make: ${make}
- Model: ${model}
- Trim: ${trim}
- Full Style: ${safeExtract(vehicleData, 'fullStyleDescription')}

- Body Style: ${bodyStyle}
- Vehicle Type: ${vehicleType}
- Condition: ${condition}
${actualMileage ? `- Actual Mileage: ${actualMileage.toLocaleString()} miles (${mileageInfo.status}, ${mileageInfo.variance}% variance)` : `- Expected Mileage: ~${expectedMileage.toLocaleString()} miles`}

${marketData ? `
EXTERNAL MARKET CONTEXT:
- Average listing price: $${marketData.averagePrice || 'Unknown'}
- Price range: $${marketData.minPrice || 'Unknown'} - $${marketData.maxPrice || 'Unknown'}
- Days on market: ${marketData.averageDom || 'Unknown'} days
- Total listings: ${marketData.listingCount || 'Unknown'}
- Market trend: ${marketData.trend || 'Unknown'}
` : 'No external data; use tools for recent comps.'}

ANALYSIS REQUIREMENTS:
1. Use 2025 trends: inflation (3-5%), EV/ICE demand shifts, supply issues, regional variations.
2. Identify value drivers (e.g., mileage premiums, rarity, condition factors).
3. Use tools for market research (e.g., web_search "${year} ${make} ${model} sales data").
4. Highlight rarities/useful finds (e.g., limited production years) with evidence/tools.
5. Aggressive on rare features; conservative on risks.
6. Independent, evidence-based reasoning based on your comprehensive market knowledge.

SPECIAL CONSIDERATIONS:
- Age: ${vehicleAge} years.
${actualMileage ? `- Mileage: Critical driver; quantify impact.` : `- Mileage: Assumed; note limits.`}
- Research rarities (e.g., tool search "${year} ${make} ${model} production history").

METHODOLOGY:
- Apply your comprehensive 2025 market expertise and knowledge.
- Weight mileage/rarities heavily.
- Use tools for accuracy (e.g., auctions, recent sales data).
- Output strict JSON.

Provide analysis in this JSON format:

{
  "market_values": {
    "retail_value": {
      "min": 0,
      "max": 0,
      "suggested_ai_price": 0,
      "description": "AI-determined dealer retail price range for ${condition} condition",
      "market_analysis": "Explain your valuation reasoning and market factors",
      "confidence_level": "High/Medium/Low and reasoning"
    },
    "private_party_value": {
      "min": 0,
      "max": 0,
      "suggested_ai_price": 0,
      "description": "AI-determined private seller realistic range for ${condition} condition",
      "market_analysis": "Explain your valuation reasoning and market factors",
      "confidence_level": "High/Medium/Low and reasoning"
    },
    "trade_in_value": {
      "min": 0,
      "max": 0,
      "suggested_ai_price": 0,
      "description": "AI-determined dealer trade-in offer range for ${condition} condition",
      "market_analysis": "Explain your valuation reasoning and market factors",
      "confidence_level": "High/Medium/Low and reasoning"
    },
    "auction_value": {
      "min": 0,
      "max": 0,
      "suggested_ai_price": 0,
      "description": "AI-determined wholesale/auction expected range",
      "market_analysis": "Explain your valuation reasoning and market factors",
      "confidence_level": "High/Medium/Low and reasoning"
    }
  },
  "key_insights": {
    "rarity_factors": "Unique/rare aspects (e.g., discontinued features, limited years) with evidence",
    "market_callouts": "2025 trends/data affecting value (e.g., comps)",
    "value_enhancers": "Positive factors and $ impact"
  },
  "ai_reasoning": {
    "primary_value_drivers": "Top 3-5 factors driving your valuation",
    "market_position": "2025 market positioning and trends",
    "pricing_strategy": "Aggressive/conservative and why",
    "key_differentiators": "What makes your AI analysis valuable"
  },
  "detailed_adjustments": {
    "mileage_impact": "${actualMileage ? `Dollar impact of ${actualMileage.toLocaleString()} vs ${expectedMileage.toLocaleString()}` : 'N/A'}",
    "condition_impact": "Dollar impact of ${condition} vs average",
    "market_trend_adjustment": "2025 trends with $ amounts",
    "brand_premium_discount": "${make} adjustments",
    "total_adjustment": "Total value adjustments and reasoning"
  },
  "performance_factors": {
    "engine_assessment": "Evaluate engine performance relative to class standards and current market expectations",
    "fuel_economy_impact": "Evaluate fuel efficiency relative to vehicle class and current market priorities"
  },
  "market_analysis": {
    "demand_level": "Assess current market demand for ${make} ${model} based on reputation and vehicle type",
    "price_trend": "Analyze ${vehicleType} market trends and brand-specific factors affecting value",
    "seasonal_factors": "Evaluate seasonal demand patterns for this vehicle type and configuration",
    "regional_variations": "Consider geographic preferences and demand variations for this vehicle type"
  },
  "risk_factors": {
    "maintenance_costs": "Assess expected maintenance costs based on engine type, age, and brand reputation",
    "reliability_outlook": "Evaluate ${make} ${model} reliability based on current market knowledge and historical data",
    "parts_availability": "Assess parts availability and cost expectations based on brand, age, and market presence",
    "age_concerns": "Evaluate age-related considerations for a ${vehicleAge}-year-old vehicle"
  },
  "recommendations": {
    "selling_strategy": "Recommend optimal selling approach based on vehicle characteristics and target market",
    "timing_advice": "Suggest optimal timing for sale based on vehicle type and seasonal factors",
    "negotiation_points": "Identify key value drivers and negotiation points for this specific vehicle",
    "documentation_needed": "Recommend necessary documentation to maximize value and buyer confidence"
  },
  "confidence_assessment": {
    "data_quality": "Medium - limited vehicle data, no baseline pricing",
    "market_volatility": "2025 market stability assessment",
    "valuation_accuracy": "Accuracy range based on available data",
    "ai_advantage": "AI market knowledge and analysis capabilities",
    "market_factors": "Key 2025 influences on valuation"
  }
}

INSTRUCTIONS:
1. Provide accurate valuations using AI market knowledge and tools.
2. Explain your reasoning clearly.
3. Show confidence with detailed reasoning.
4. Factor in 2025 market conditions.
${actualMileage ? `5. Quantify mileage impact.` : `5. Note mileage assumptions.`}
6. Show your work; be confident but acknowledge limitations.
7. Use tools before JSON if needed for market research.
8. Call out rarities in key_insights with evidence.
`;
};

module.exports = {
  buildEnhancedReasoningPrompt
};