// ai-prompts/ai-prompt-8-5.js
export const buildEnhancedReasoningPrompt = (vehicleData, condition = 'good', marketData = null, actualMileage = null) => {
  console.log('🔍 Analyzing vehicle with enhanced reasoning prompt...');
  console.log('🔍 Vehicle data:', vehicleData);
  console.log('🔍 Actual mileage:', actualMileage);

  // Helper function to safely extract values with defaults
  const safeExtract = (obj, path, defaultValue = 'Unknown') => {
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : defaultValue), obj);
  };

  // Extract detailed specs with safer handling
  const engineSpecs = {
    displacement: safeExtract(vehicleData, 'engine.size') || safeExtract(vehicleData, 'engine.displacement'),
    horsepower: safeExtract(vehicleData, 'engine.horsepower'),
    torque: safeExtract(vehicleData, 'engine.torque'),
    fuelType: safeExtract(vehicleData, 'engine.fuelType'),
    turbocharged: safeExtract(vehicleData, 'engine.compressorType') === 'turbocharger',
    cylinders: safeExtract(vehicleData, 'engine.cylinder') || safeExtract(vehicleData, 'engine.cylinders'),
    configuration: safeExtract(vehicleData, 'engine.configuration'),
  };

  const transmissionInfo = {
    type: safeExtract(vehicleData, 'transmission.transmissionType'),
    speeds: safeExtract(vehicleData, 'transmission.numberOfSpeeds'),
    name: safeExtract(vehicleData, 'transmission.name'),
  };

  // Core data extraction with defaults
  const year = safeExtract(vehicleData, 'year');
  const make = safeExtract(vehicleData, 'make.name');
  const model = safeExtract(vehicleData, 'model.name');
  const trim = safeExtract(vehicleData, 'trim');
  const driveType = safeExtract(vehicleData, 'driveType');
  const bodyStyle = safeExtract(vehicleData, 'bodyStyle.body') || safeExtract(vehicleData, 'specifications.vehicleStyle');
  const marketCategory = safeExtract(vehicleData, 'specifications.market', 'Standard');
  const epaClass = safeExtract(vehicleData, 'specifications.epaClass');
  const cityMpg = safeExtract(vehicleData, 'fuelEconomy.city');
  const highwayMpg = safeExtract(vehicleData, 'fuelEconomy.highway');
  const squishVin = safeExtract(vehicleData, 'metadata.squishVin');
  const vehicleType = safeExtract(vehicleData, 'specifications.vehicleType');

  // Calculate combined MPG with parsing
  const combinedMpg = (cityMpg !== 'Unknown' && highwayMpg !== 'Unknown' && !isNaN(parseInt(cityMpg)) && !isNaN(parseInt(highwayMpg)))
    ? Math.round((parseInt(cityMpg) + parseInt(highwayMpg)) / 2)
    : 'Unknown';

  // Build engine description
  const engineDescription = `${engineSpecs.displacement || 'Unknown'}L ${engineSpecs.horsepower || 'Unknown'}HP ${
    engineSpecs.turbocharged ? 'Turbo ' : ''
  }${engineSpecs.configuration || ''} ${engineSpecs.cylinders || 'Unknown'}-cylinder`;

  // Build transmission description
  const transmissionDescription = `${transmissionInfo.speeds || 'Unknown'}-speed ${transmissionInfo.type || 'Unknown'}`;

  // Determine drivetrain advantages
  const drivetrainType = driveType.toLowerCase().includes('four') || 
                        driveType.toLowerCase().includes('4wd') || 
                        driveType.toLowerCase().includes('awd') ? 'AWD/4WD' : 'Standard';

  const vehicleAge = year ? 2025 - year : 'Unknown';
  const expectedMileage = year ? vehicleAge * 13500 : 'Unknown'; // Updated to more accurate industry average of 13,500 miles/year

  // Build mileage information
  const mileageInfo = actualMileage 
    ? {
        actual: actualMileage,
        expected: expectedMileage,
        status: actualMileage < expectedMileage * 0.8 ? 'significantly below average' :  // Added thresholds for better nuance
                actualMileage < expectedMileage ? 'below average' :
                actualMileage > expectedMileage * 1.2 ? 'significantly above average' :
                actualMileage > expectedMileage ? 'above average' : 'average',
        variance: Math.abs(Math.round(((expectedMileage - actualMileage) / expectedMileage) * 100)),
      }
    : {
        expected: expectedMileage,
        status: 'estimated'
      };

  // Build pricing section cleanly with better formatting and handling
  const buildPricingSection = () => {
    const pricing = safeExtract(vehicleData, 'pricing', {});
    let pricingLines = [
      `- Retail Value: $${pricing.usedTmvRetail || 'Unknown'}`,
      `- Private Party: $${pricing.usedPrivateParty || 'Unknown'}`,
      `- Trade-in Value: $${pricing.usedTradeIn || 'Unknown'}`
    ];

    if (pricing.baseMsrp) pricingLines.push(`- Original MSRP: $${pricing.baseMsrp}`);
    if (pricing.baseInvoice) pricingLines.push(`- Original Invoice: $${pricing.baseInvoice}`);
    if (pricing.deliveryCharges) pricingLines.push(`- Delivery Charges: $${pricing.deliveryCharges}`);
    if (pricing.tmvRecommendedRating !== undefined) pricingLines.push(`- TMV Rating: ${pricing.tmvRecommendedRating}`);
    
    pricingLines.push(`- Price Estimate Quality: ${pricing.estimateTmv ? 'Estimated' : 'Actual Market Data'}`);
    
    return pricingLines.join('\n');
  };

  // Trimmed prompt: Removed redundancies (e.g., merged mission/instructions, shortened lists), kept core for special findings/tools
  return `
You are an AI-powered automotive appraiser for DriveValueAI. Provide MORE ACCURATE valuations than baseline auto.dev data using market analysis, 2025 trends, and tools for real-time data.

VEHICLE SPECIFICATIONS:
- Year: ${year}
- Make: ${make}
- Model: ${model}
- Trim: ${trim}
- Full Style: ${safeExtract(vehicleData, 'fullStyleDescription')}
- Engine: ${engineDescription}
- Transmission: ${transmissionDescription}
- Drivetrain: ${driveType}
- Body Style: ${bodyStyle}
- Market Category: ${marketCategory}
- EPA Class: ${epaClass}
- Fuel Economy: ${cityMpg}/${highwayMpg} mpg (Combined: ${combinedMpg})
- Doors: ${safeExtract(vehicleData, 'specifications.doors')}
- Vehicle Size: ${safeExtract(vehicleData, 'specifications.vehicleSize')}
- Vehicle Type: ${vehicleType}
- VIN Pattern: ${squishVin}
- Condition: ${condition}
${actualMileage ? `- Actual Mileage: ${actualMileage.toLocaleString()} miles (${mileageInfo.status}, ${mileageInfo.variance}% variance)` : `- Expected Mileage: ~${expectedMileage.toLocaleString()} miles`}

BASELINE DATA (REFERENCE ONLY):
${buildPricingSection()}

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
2. Identify baseline misses (e.g., mileage premiums, rarity).
3. Use tools for gaps (e.g., web_search "${year} ${make} ${model} sales data").
4. Highlight rarities/useful finds (e.g., limited production years) with evidence/tools.
5. Aggressive on rare features; conservative on risks.
6. Independent, evidence-based reasoning.

SPECIAL CONSIDERATIONS:
- Age: ${vehicleAge} years.
- Drivetrain: ${drivetrainType}.
- Transmission: ${transmissionInfo.type || 'Unknown'} (manuals +10-20% premium).
${actualMileage ? `- Mileage: Critical driver; quantify impact.` : `- Mileage: Assumed; note limits.`}
- Research rarities (e.g., tool search "${year} ${make} ${model} production history").

METHODOLOGY:
- Reference baseline; apply 2025 expertise.
- Weight mileage/rarities heavily.
- Use tools for accuracy (e.g., auctions).
- Output strict JSON.

Provide analysis in this JSON format:

{
  "market_values": {
    "retail_value": {
      "min": 0,
      "max": 0,
      "suggested_ai_price": 0,
      "description": "AI-determined dealer retail price range for ${condition} condition",
      "baseline_comparison": "Explain how/why your value differs from baseline $${safeExtract(vehicleData, 'pricing.usedTmvRetail')}",
      "confidence_level": "High/Medium/Low and reasoning"
    },
    "private_party_value": {
      "min": 0,
      "max": 0,
      "suggested_ai_price": 0,
      "description": "AI-determined private seller realistic range for ${condition} condition",
      "baseline_comparison": "Explain how/why your value differs from baseline $${safeExtract(vehicleData, 'pricing.usedPrivateParty')}",
      "confidence_level": "High/Medium/Low and reasoning"
    },
    "trade_in_value": {
      "min": 0,
      "max": 0,
      "suggested_ai_price": 0,
      "description": "AI-determined dealer trade-in offer range for ${condition} condition",
      "baseline_comparison": "Explain how/why your value differs from baseline $${safeExtract(vehicleData, 'pricing.usedTradeIn')}",
      "confidence_level": "High/Medium/Low and reasoning"
    },
    "auction_value": {
      "min": 0,
      "max": 0,
      "suggested_ai_price": 0,
      "description": "AI-determined wholesale/auction expected range",
      "baseline_comparison": "Explain reasoning vs baseline data",
      "confidence_level": "High/Medium/Low and reasoning"
    }
  },
  "key_insights": {
    "rarity_factors": "Unique/rare aspects (e.g., discontinued features, limited years) with evidence",
    "market_callouts": "2025 trends/data affecting value (e.g., comps)",
    "value_enhancers": "Positive factors and $ impact"
  },
  "ai_reasoning": {
    "primary_value_drivers": "Top 3-5 factors",
    "baseline_analysis": "Baseline misses/errors",
    "market_position": "2025 positioning",
    "pricing_strategy": "Aggressive/conservative and why",
    "key_differentiators": "AI advantages"
  },
  "detailed_adjustments": {
    "mileage_impact": "${actualMileage ? `Dollar impact of ${actualMileage.toLocaleString()} vs ${expectedMileage.toLocaleString()}` : 'N/A'}",
    "condition_impact": "Dollar impact of ${condition} vs average",
    "market_trend_adjustment": "2025 trends with $ amounts",
    "brand_premium_discount": "${make} adjustments",
    "total_adjustment": "Total $ from baseline and reasoning"
  },
  "performance_factors": {
    "engine_assessment": "Evaluate engine performance relative to class standards and current market expectations",
    "drivetrain_impact": "Assess how ${drivetrainType} affects utility, appeal, and value in current market",
    "transmission_preference": "Analyze ${transmissionInfo.type || 'transmission'} type impact on market appeal and buyer demographics",
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
    "data_quality": "${safeExtract(vehicleData, 'pricing.usedTmvRetail') ? 'High' : 'Medium'}",
    "market_volatility": "2025 stability",
    "valuation_accuracy": "Accuracy range",
    "ai_advantage": "AI improvements",
    "market_factors": "Key 2025 influences"
  }
}

INSTRUCTIONS:
1. Beat baseline with AI/tools.
2. Explain differences.
3. Confidence with reasoning.
4. Factor 2025 conditions.
${actualMileage ? `5. Quantify mileage impact.` : `5. Note mileage limits.`}
5. Show work; confident but limited.
6. Tools before JSON if needed.
7. Call out rarities in key_insights with evidence.
`;
};