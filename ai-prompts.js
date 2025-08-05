// AI Prompts for vehicle valuation analysis
// Shared between Claude and Grok services

/**
 * Builds an enhanced reasoning prompt for vehicle valuation
 * @param {Object} vehicleData - Structured vehicle data
 * @param {string} condition - Vehicle condition
 * @param {Object} marketData - Market data
 * @param {number} actualMileage - Actual mileage of the vehicle
 * @returns {string} - Enhanced reasoning prompt
 */
const buildEnhancedReasoningPrompt = (vehicleData, condition = 'good', marketData = null, actualMileage = null) => {
  console.log('🔍 Building enhanced reasoning prompt...');
  console.log('🔍 Vehicle data:', vehicleData);
  console.log('🔍 Actual mileage:', actualMileage);

  // Extract detailed specs
  const engineSpecs = vehicleData.engine ? {
    displacement: vehicleData.engine.size || vehicleData.engine.displacement,
    horsepower: vehicleData.engine.horsepower,
    torque: vehicleData.engine.torque,
    fuelType: vehicleData.engine.fuelType,
    turbocharged: vehicleData.engine.compressorType === 'turbocharger',
    cylinders: vehicleData.engine.cylinder || vehicleData.engine.cylinders,
    configuration: vehicleData.engine.configuration
  } : {};

  const transmissionInfo = vehicleData.transmission ? {
    type: vehicleData.transmission.transmissionType,
    speeds: vehicleData.transmission.numberOfSpeeds,
    name: vehicleData.transmission.name
  } : {};

  // Core data extraction
  const year = vehicleData.year;
  const make = vehicleData.make?.name || 'Unknown';
  const model = vehicleData.model?.name || 'Unknown';
  const trim = vehicleData.trim || 'Base';
  const driveType = vehicleData.driveType || 'Unknown';
  const bodyStyle = vehicleData.bodyStyle?.body || vehicleData.specifications?.vehicleStyle || 'Unknown';
  const marketCategory = vehicleData.specifications?.market || 'Standard';
  const epaClass = vehicleData.specifications?.epaClass || 'Unknown';
  const cityMpg = vehicleData.fuelEconomy?.city || 'Unknown';
  const highwayMpg = vehicleData.fuelEconomy?.highway || 'Unknown';
  const squishVin = vehicleData.metadata?.squishVin || 'Unknown';
  const vehicleType = vehicleData.specifications?.vehicleType || 'Unknown';

  // Calculate combined MPG
  const combinedMpg = (cityMpg !== 'Unknown' && highwayMpg !== 'Unknown') 
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
  const expectedMileage = year ? (2025 - year) * 12000 : 'Unknown';
  
  // Build mileage information
  const mileageInfo = actualMileage 
    ? {
        actual: actualMileage,
        expected: expectedMileage,
        status: actualMileage < expectedMileage ? 'below average' : 
                actualMileage > expectedMileage ? 'above average' : 'average',
        variance: Math.round(((expectedMileage - actualMileage) / expectedMileage) * 100)
      }
    : {
        expected: expectedMileage,
        status: 'estimated'
      };

  // Build pricing section cleanly
  const buildPricingSection = () => {
    let pricingLines = [
      `- Retail Value: $${vehicleData.pricing?.usedTmvRetail || 'Unknown'}`,
      `- Private Party: $${vehicleData.pricing?.usedPrivateParty || 'Unknown'}`,
      `- Trade-in Value: $${vehicleData.pricing?.usedTradeIn || 'Unknown'}`
    ];

    if (vehicleData.pricing?.baseMsrp) {
      pricingLines.push(`- Original MSRP: $${vehicleData.pricing.baseMsrp}`);
    }
    if (vehicleData.pricing?.baseInvoice) {
      pricingLines.push(`- Original Invoice: $${vehicleData.pricing.baseInvoice}`);
    }
    if (vehicleData.pricing?.deliveryCharges) {
      pricingLines.push(`- Delivery Charges: $${vehicleData.pricing.deliveryCharges}`);
    }
    if (vehicleData.pricing?.tmvRecommendedRating !== undefined) {
      pricingLines.push(`- TMV Rating: ${vehicleData.pricing.tmvRecommendedRating}`);
    }
    
    pricingLines.push(`- Price Estimate Quality: ${vehicleData.pricing?.estimateTmv ? 'Estimated' : 'Actual Market Data'}`);
    
    return pricingLines.join('\n');
  };

  return `
You are an AI-powered automotive appraiser for DriveValueAI. Your job is to provide MORE ACCURATE valuations than baseline auto.dev data by using advanced market analysis and current trends.

🎯 MISSION: Beat the baseline data accuracy by leveraging AI's comprehensive market knowledge and real-time analysis.

VEHICLE SPECIFICATIONS:
- Year: ${year}
- Make: ${make}
- Model: ${model}
- Trim: ${trim}
- Full Style: ${vehicleData.fullStyleDescription || 'Unknown'}
- Engine: ${engineDescription}
- Transmission: ${transmissionDescription}
- Drivetrain: ${driveType}
- Body Style: ${bodyStyle}
- Market Category: ${marketCategory}
- EPA Class: ${epaClass}
- Fuel Economy: ${cityMpg}/${highwayMpg} mpg (Combined: ${combinedMpg})
- Doors: ${vehicleData.specifications?.doors || 'Unknown'}
- Vehicle Size: ${vehicleData.specifications?.vehicleSize || 'Unknown'}
- Vehicle Type: ${vehicleType}
- VIN Pattern: ${squishVin}
- Condition: ${condition}
${actualMileage ? `- Actual Mileage: ${actualMileage.toLocaleString()} miles (${mileageInfo.status} for age - ${mileageInfo.variance}% ${mileageInfo.status.includes('below') ? 'BELOW' : mileageInfo.status.includes('above') ? 'ABOVE' : 'AT'} average)` : `- Expected Mileage: ~${expectedMileage.toLocaleString()} miles (12k/year average)`}

BASELINE DATA (auto.dev - STARTING POINT ONLY):
${buildPricingSection()}

⚠️ IMPORTANT: These baseline values are just a starting reference point. They may be OUTDATED, INACCURATE, or miss key factors. Your job is to provide BETTER, more accurate 2025 valuations.

${marketData ? `
EXTERNAL MARKET CONTEXT:
- Average listing price: $${marketData.averagePrice || 'Unknown'}
- Price range: $${marketData.minPrice || 'Unknown'} - $${marketData.maxPrice || 'Unknown'}
- Days on market: ${marketData.averageDom || 'Unknown'} days
- Total listings: ${marketData.listingCount || 'Unknown'}
- Market trend: ${marketData.trend || 'Unknown'}
` : ''}

AI ANALYSIS REQUIREMENTS:
1. Act as an expert appraiser with access to 2025 market trends, sales data, and economic conditions
2. Identify specific factors the baseline data likely MISSED or UNDERVALUED
3. Apply current market knowledge that auto.dev may not have captured
4. Factor in 2025-specific conditions: inflation, supply chain issues, EV market impact, collector trends
5. Provide your INDEPENDENT professional assessment with detailed reasoning
6. Be aggressive where market data supports it, conservative where warranted - but EXPLAIN why

SPECIAL CONSIDERATIONS FOR THIS VEHICLE:
- Vehicle age: ${vehicleAge} years old (${year} model year)
- Drivetrain: ${drivetrainType} system
- Transmission: ${transmissionInfo.type || 'Unknown'} transmission
- Vehicle category: ${vehicleType}
${actualMileage ? 
  `- 🚨 CRITICAL FACTOR: Vehicle has ONLY ${actualMileage.toLocaleString()} actual miles vs ${expectedMileage.toLocaleString()} expected (${mileageInfo.variance}% below average)
- This low mileage is a MAJOR value driver that baseline data may not fully capture
- Low-mileage examples are increasingly rare and valuable in 2025` :
  `- Mileage Assumption: Approximately ${expectedMileage.toLocaleString()} miles estimated (12k/year average)`
}

AI VALUATION METHODOLOGY:
- START with baseline data as reference only
- APPLY your 2025 market expertise and current trends analysis
- FACTOR real-world market conditions: inflation, supply constraints, buyer behavior changes
- CONSIDER collector/enthusiast market trends for older vehicles
- ACCOUNT for regional demand variations and seasonal factors
- WEIGHT actual condition and mileage heavily (if provided)
- PROVIDE more accurate valuations than baseline data by using AI advantages

Please provide a comprehensive AI-powered analysis in this JSON format:

{
  "market_values": {
    "retail_value": {
      "min": 0,
      "max": 0,
      "suggested_ai_price": 0,
      "description": "AI-determined dealer retail price range for ${condition} condition",
      "baseline_comparison": "Explain how and why your value differs from baseline $${vehicleData.pricing?.usedTmvRetail}",
      "confidence_level": "High/Medium/Low and reasoning"
    },
    "private_party_value": {
      "min": 0,
      "max": 0,
      "suggested_ai_price": 0,
      "description": "AI-determined private seller realistic range for ${condition} condition",
      "baseline_comparison": "Explain how and why your value differs from baseline $${vehicleData.pricing?.usedPrivateParty}",
      "confidence_level": "High/Medium/Low and reasoning"
    },
    "trade_in_value": {
      "min": 0,
      "max": 0,
      "suggested_ai_price": 0,
      "description": "AI-determined dealer trade-in offer range for ${condition} condition",
      "baseline_comparison": "Explain how and why your value differs from baseline $${vehicleData.pricing?.usedTradeIn}",
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
  "ai_reasoning": {
    "primary_value_drivers": "List the top 3-5 factors that most influenced your valuation decisions",
    "baseline_analysis": "Specific assessment of what the baseline data likely missed or got wrong",
    "market_position": "Where this vehicle sits in current 2025 market conditions",
    "pricing_strategy": "Explain whether you were aggressive, conservative, or neutral and why",
    "key_differentiators": "What makes your AI valuation more accurate than baseline data"
  },
  "detailed_adjustments": {
    "mileage_impact": "${actualMileage ? `Specific dollar impact of ${actualMileage.toLocaleString()} vs ${expectedMileage.toLocaleString()} miles` : 'N/A - using estimated mileage'}",
    "condition_impact": "Dollar impact of ${condition} condition vs average",
    "market_trend_adjustment": "2025 market trend adjustments with dollar amounts",
    "brand_premium_discount": "${make} brand-specific adjustments",
    "total_adjustment": "Total dollar adjustment from baseline and reasoning"
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
    "data_quality": "${vehicleData.pricing?.usedTmvRetail ? 'High - baseline market data available' : 'Medium - limited baseline data available'}",
    "market_volatility": "Assess current market stability for this vehicle type and brand in 2025",
    "valuation_accuracy": "Estimate accuracy range based on available data, market factors, and AI analysis confidence",
    "ai_advantage": "Explain specifically how AI analysis provides more accurate valuation than baseline data",
    "market_factors": "Key 2025 market conditions influencing your independent assessment"
  }
}

CRITICAL INSTRUCTIONS:
1. Your valuations should be MORE ACCURATE than baseline auto.dev data by leveraging AI market analysis
2. Be specific about WHY you chose higher or lower values than baseline
3. Explain your confidence level for each valuation category
4. Identify what the baseline data likely missed or got wrong
5. Factor in 2025 market conditions that baseline data may not reflect
${actualMileage ? 
  `6. HEAVILY weight the ${mileageInfo.variance}% below-average mileage as a major value driver
7. Explain specifically how low mileage impacts each price category` :
  `6. Use standard mileage assumptions but note this limitation`
}
8. Show your work - provide detailed reasoning for all pricing decisions
9. Be confident in your AI-powered analysis while acknowledging limitations

Remember: Your goal is to provide MORE ACCURATE valuations than baseline data by using AI's comprehensive market knowledge and analysis capabilities.
`;
};

// old before enhanced cost
const buildVehicleValuationPrompt = (vehicleData, condition = 'good', marketData = null, actualMileage = null) => {
  console.log('🔍 Building enhanced vehicle valuation prompt...');
  console.log('🔍 Vehicle data:', vehicleData);

  // Extract detailed specs from the NEW structured data format
  const engineSpecs = vehicleData.engine ? {
    displacement: vehicleData.engine.size || vehicleData.engine.displacement,
    horsepower: vehicleData.engine.horsepower,
    torque: vehicleData.engine.torque,
    fuelType: vehicleData.engine.fuelType,
    turbocharged: vehicleData.engine.compressorType === 'turbocharger',
    cylinders: vehicleData.engine.cylinder || vehicleData.engine.cylinders,
    configuration: vehicleData.engine.configuration
  } : {};

  const transmissionInfo = vehicleData.transmission ? {
    type: vehicleData.transmission.transmissionType,
    speeds: vehicleData.transmission.numberOfSpeeds,
    name: vehicleData.transmission.name
  } : {};

  // Fix the data access paths based on your actual structure
  const year = vehicleData.year;
  const make = vehicleData.make?.name || 'Unknown';
  const model = vehicleData.model?.name || 'Unknown';
  const trim = vehicleData.trim || 'Base';
  const driveType = vehicleData.driveType || 'Unknown';
  const bodyStyle = vehicleData.bodyStyle?.body || vehicleData.specifications?.vehicleStyle || 'Unknown';
  const marketCategory = vehicleData.specifications?.market || 'Standard';
  const epaClass = vehicleData.specifications?.epaClass || 'Unknown';
  const cityMpg = vehicleData.fuelEconomy?.city || 'Unknown';
  const highwayMpg = vehicleData.fuelEconomy?.highway || 'Unknown';
  const squishVin = vehicleData.metadata?.squishVin || 'Unknown';
  const vehicleType = vehicleData.specifications?.vehicleType || 'Unknown';

  // Calculate combined MPG if possible
  const combinedMpg = (cityMpg !== 'Unknown' && highwayMpg !== 'Unknown') 
    ? Math.round((parseInt(cityMpg) + parseInt(highwayMpg)) / 2)
    : 'Unknown';

  // Build engine description
  const engineDescription = `${engineSpecs.displacement || 'Unknown'}L ${engineSpecs.horsepower || 'Unknown'}HP ${
    engineSpecs.turbocharged ? 'Turbo ' : ''
  }${engineSpecs.configuration || ''} ${engineSpecs.cylinders || 'Unknown'}-cylinder`;

  // Build transmission description
  const transmissionDescription = `${transmissionInfo.speeds || 'Unknown'}-speed ${transmissionInfo.type || 'Unknown'}`;

  // Determine drivetrain advantages neutrally
  const drivetrainType = driveType.toLowerCase().includes('four') || 
                        driveType.toLowerCase().includes('4wd') || 
                        driveType.toLowerCase().includes('awd') ? 'AWD/4WD' : 'Standard';

  const vehicleAge = year ? 2025 - year : 'Unknown';
  const expectedMileage = year ? (2025 - year) * 12000 : 'Unknown';
  
  // Build mileage information - use actual if provided, otherwise show expected
  const mileageInfo = actualMileage 
    ? {
        actual: actualMileage,
        expected: expectedMileage,
        status: actualMileage < expectedMileage ? 'below average' : 
                actualMileage > expectedMileage ? 'above average' : 'average'
      }
    : {
        expected: expectedMileage,
        status: 'estimated'
      };

  // Build pricing section cleanly
  const buildPricingSection = () => {
    let pricingLines = [
      `- Retail Value: $${vehicleData.pricing?.usedTmvRetail || 'Unknown'}`,
      `- Private Party: $${vehicleData.pricing?.usedPrivateParty || 'Unknown'}`,
      `- Trade-in Value: $${vehicleData.pricing?.usedTradeIn || 'Unknown'}`
    ];

    // Only add optional fields if they exist
    if (vehicleData.pricing?.baseMsrp) {
      pricingLines.push(`- Original MSRP: $${vehicleData.pricing.baseMsrp}`);
    }
    if (vehicleData.pricing?.baseInvoice) {
      pricingLines.push(`- Original Invoice: $${vehicleData.pricing.baseInvoice}`);
    }
    if (vehicleData.pricing?.deliveryCharges) {
      pricingLines.push(`- Delivery Charges: $${vehicleData.pricing.deliveryCharges}`);
    }
    if (vehicleData.pricing?.tmvRecommendedRating !== undefined) {
      pricingLines.push(`- TMV Rating: ${vehicleData.pricing.tmvRecommendedRating}`);
    }
    
    // Always add price estimate quality
    pricingLines.push(`- Price Estimate Quality: ${vehicleData.pricing?.estimateTmv ? 'Estimated' : 'Actual Market Data'}`);
    
    return pricingLines.join('\n');
  };

  return `
You are a professional automotive appraiser with access to current market data. Analyze this vehicle objectively using the provided specifications and market context.

VEHICLE SPECIFICATIONS:
- Year: ${year}
- Make: ${make}
- Model: ${model}
- Trim: ${trim}
- Full Style: ${vehicleData.fullStyleDescription || 'Unknown'}
- Engine: ${engineDescription}
- Transmission: ${transmissionDescription}
- Drivetrain: ${driveType}
- Body Style: ${bodyStyle}
- Market Category: ${marketCategory}
- EPA Class: ${epaClass}
- Fuel Economy: ${cityMpg}/${highwayMpg} mpg (Combined: ${combinedMpg})
- Doors: ${vehicleData.specifications?.doors || 'Unknown'}
- Vehicle Size: ${vehicleData.specifications?.vehicleSize || 'Unknown'}
- Vehicle Type: ${vehicleType}
- VIN Pattern: ${squishVin}
- Condition: ${condition}
${actualMileage ? `- Actual Mileage: ${actualMileage.toLocaleString()} miles (${mileageInfo.status} for age)` : `- Expected Mileage: ~${expectedMileage.toLocaleString()} miles (12k/year average)`}

CURRENT MARKET DATA (from auto.dev):
${buildPricingSection()}

AVAILABLE OPTIONS & FEATURES:
${vehicleData.options?.length > 0 
  ? vehicleData.options.map(opt => `- ${opt.name}: ${opt.description || 'Available'}`).join('\n') 
  : 'Standard equipment only'}

${marketData ? `
EXTERNAL MARKET CONTEXT:
- Average listing price: $${marketData.averagePrice || 'Unknown'}
- Price range: $${marketData.minPrice || 'Unknown'} - $${marketData.maxPrice || 'Unknown'}
- Days on market: ${marketData.averageDom || 'Unknown'} days
- Total listings: ${marketData.listingCount || 'Unknown'}
- Market trend: ${marketData.trend || 'Unknown'}
` : ''}

ANALYSIS REQUIREMENTS:
1. Evaluate this ${year} ${make} ${model} ${trim} based on current market knowledge of the brand and model reputation
2. Assess the ${engineSpecs.turbocharged ? 'turbocharged' : 'naturally aspirated'} ${engineSpecs.displacement}L engine performance relative to class standards
3. Consider the advantages and disadvantages of ${driveType} drivetrain for this vehicle type
4. Analyze ${make}'s market reputation for reliability and resale value based on current industry data
5. Evaluate current market demand for this vehicle type, vintage, and configuration
6. Assess the impact of ${transmissionInfo.type?.toLowerCase()} transmission on market appeal and value

SPECIAL CONSIDERATIONS FOR THIS VEHICLE:
- Vehicle age: ${vehicleAge} years old (${year} model year)
- Drivetrain: ${drivetrainType} system
- Transmission: ${transmissionInfo.type || 'Unknown'} transmission
- Vehicle category: ${vehicleType}
${actualMileage ? 
  `- CRITICAL MILEAGE FACTOR: Vehicle has ONLY ${actualMileage.toLocaleString()} actual miles vs ${expectedMileage.toLocaleString()} expected for age
- Mileage Status: This vehicle has ${mileageInfo.status} mileage (${Math.round(((expectedMileage - actualMileage) / expectedMileage) * 100)}% below average)
- VALUE IMPACT: Low mileage should significantly INCREASE value above baseline estimates` :
  `- Mileage Assumption: Approximately ${expectedMileage.toLocaleString()} miles estimated (12k/year average)`
}

VALUATION METHODOLOGY:
- Consider the auto.dev market data as ONE reference point among many
- Apply your comprehensive knowledge of current 2025 market conditions, trends, and pricing
- Factor in actual market demand, recent sales data, and current economic conditions
- Apply condition adjustments: Excellent (+15%), Good (base), Fair (-15%), Poor (-25%)
- Consider regional market variations (±5-10%)
${actualMileage ? 
  `- Significantly factor in actual mileage (${actualMileage.toLocaleString()}) vs expected (${expectedMileage.toLocaleString()}) - this should substantially impact valuation` :
  `- Factor in typical mileage expectations for vehicle age (assuming 12k/year average)`
}
- Account for brand and model-specific market factors based on current reputation
- Consider transmission type and drivetrain impact on target market appeal
- IMPORTANT: If current market conditions suggest values significantly different from baseline data, provide your independent assessment with clear reasoning

Please provide a comprehensive analysis with realistic current market values in this JSON format:

{
  "market_values": {
    "retail_value": {
      "min": 0,
      "max": 0,
      "suggested_ai_price": 0,
      "description": "Dealer retail price range for ${condition} condition"
    },
    "private_party_value": {
      "min": 0,
      "max": 0,
      "suggested_ai_price": 0,
      "description": "Private seller realistic range for ${condition} condition"
    },
    "trade_in_value": {
      "min": 0,
      "max": 0,
      "suggested_ai_price": 0,
      "description": "Dealer trade-in offer range for ${condition} condition"
    },
    "auction_value": {
      "min": 0,
      "max": 0,
      "suggested_ai_price": 0,
      "description": "Wholesale/auction expected range"
    }
  },
  "performance_factors": {
    "engine_assessment": "Evaluate engine performance relative to class standards and market expectations",
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
    "data_quality": "${vehicleData.pricing?.usedTmvRetail ? 'High - baseline market data available' : 'Medium - limited baseline data available'}",
    "market_volatility": "Assess current market stability for this vehicle type and brand in 2025",
    "valuation_accuracy": "Estimate accuracy range based on available data, market factors, and confidence in assessment",
    "baseline_variance": "Explain if and why your valuation differs from the provided baseline data",
    "market_factors": "Key 2025 market conditions influencing your independent assessment"
  }
}

IMPORTANT GUIDELINES:
1. Provide realistic 2025 market values for this ${year} ${make} ${model} based on your comprehensive market knowledge
2. Reference baseline values: Retail ${vehicleData.pricing?.usedTmvRetail || 'Unknown'}, Private Party ${vehicleData.pricing?.usedPrivateParty || 'Unknown'}, Trade-in ${vehicleData.pricing?.usedTradeIn || 'Unknown'}${vehicleData.pricing?.baseMsrp ? `, Original MSRP ${vehicleData.pricing.baseMsrp}` : ''}
3. If current market conditions, demand trends, or vehicle specifics suggest different values, provide your independent assessment with clear reasoning
4. Consider current 2025 factors: inflation, supply chain issues, EV market impact, changing buyer preferences, economic conditions
5. Factor in the ${vehicleAge}-year age factor and its impact on value expectations
${actualMileage ? 
  `6. CRITICAL: Vehicle has ONLY ${actualMileage.toLocaleString()} miles (${Math.round(((expectedMileage - actualMileage) / expectedMileage) * 100)}% below average) - this LOW MILEAGE should SIGNIFICANTLY INCREASE values above baseline` :
  `6. Factor in estimated mileage based on age assumptions`
}
7. Provide confident, well-reasoned analysis based on current automotive market expertise
8. If your assessment differs significantly from baseline, explain the market factors driving the difference
`;
};

// Low Cost Prompt TEST
const buildOptimizedVehicleValuationPrompt = (vehicleData, condition = 'good', marketData = null, actualMileage = null) => {
  console.log('🔍 Building optimized vehicle valuation prompt...');
  console.log('🔍 Vehicle data:', vehicleData);
  console.log('🔍 Actual mileage:', actualMileage);

  // Extract specs efficiently
  const engineSpecs = vehicleData.engine ? {
    displacement: vehicleData.engine.size || vehicleData.engine.displacement,
    horsepower: vehicleData.engine.horsepower,
    turbocharged: vehicleData.engine.compressorType === 'turbocharger',
    cylinders: vehicleData.engine.cylinder || vehicleData.engine.cylinders,
    configuration: vehicleData.engine.configuration
  } : {};

  const transmissionInfo = vehicleData.transmission ? {
    type: vehicleData.transmission.transmissionType,
    speeds: vehicleData.transmission.numberOfSpeeds
  } : {};

  // Core data extraction
  const year = vehicleData.year;
  const make = vehicleData.make?.name || 'Unknown';
  const model = vehicleData.model?.name || 'Unknown';
  const trim = vehicleData.trim || 'Base';
  const driveType = vehicleData.driveType || 'Unknown';
  const vehicleType = vehicleData.specifications?.vehicleType || 'Unknown';
  const cityMpg = vehicleData.fuelEconomy?.city || 'Unknown';
  const highwayMpg = vehicleData.fuelEconomy?.highway || 'Unknown';
  const combinedMpg = (cityMpg !== 'Unknown' && highwayMpg !== 'Unknown') 
    ? Math.round((parseInt(cityMpg) + parseInt(highwayMpg)) / 2) : 'Unknown';

  const vehicleAge = year ? 2025 - year : 'Unknown';
  const expectedMileage = year ? (2025 - year) * 12000 : 'Unknown';
  
  // Mileage analysis
  const mileageInfo = actualMileage ? {
    actual: actualMileage,
    expected: expectedMileage,
    variance: Math.round(((expectedMileage - actualMileage) / expectedMileage) * 100)
  } : null;

  // Build compact engine description
  const engineDesc = `${engineSpecs.displacement}L ${engineSpecs.horsepower}HP ${engineSpecs.turbocharged ? 'Turbo ' : ''}${engineSpecs.configuration || ''} ${engineSpecs.cylinders}-cyl`;
  
  // Build compact transmission description
  const transDesc = `${transmissionInfo.speeds}-speed ${transmissionInfo.type || 'Unknown'}`;

  // Determine drivetrain type
  const drivetrainType = driveType.toLowerCase().includes('four') || 
                        driveType.toLowerCase().includes('4wd') || 
                        driveType.toLowerCase().includes('awd') ? 'AWD/4WD' : 'Standard';

  // Build compact pricing section
  const pricingData = [
    `Retail: $${vehicleData.pricing?.usedTmvRetail}`,
    `Private: $${vehicleData.pricing?.usedPrivateParty}`,
    `Trade: $${vehicleData.pricing?.usedTradeIn}`
  ];
  
  if (vehicleData.pricing?.baseMsrp) {
    pricingData.push(`MSRP: $${vehicleData.pricing.baseMsrp}`);
  }

  return `Professional automotive appraiser: Analyze this vehicle objectively using provided specifications and market context.

VEHICLE: ${year} ${make} ${model} ${trim}
Style: ${vehicleData.fullStyleDescription || 'Unknown'}
Engine: ${engineDesc}
Trans: ${transDesc}, ${driveType}
Economy: ${cityMpg}/${highwayMpg} MPG (${combinedMpg} combined)
Type: ${vehicleType}, ${vehicleData.specifications?.doors || 'Unknown'} doors
Condition: ${condition}${actualMileage ? `
Mileage: ${actualMileage.toLocaleString()} actual vs ${expectedMileage.toLocaleString()} expected (${mileageInfo.variance}% below average)` : `
Expected Mileage: ~${expectedMileage.toLocaleString()}`}

MARKET DATA:
${pricingData.join(', ')}
Quality: ${vehicleData.pricing?.estimateTmv ? 'Estimated' : 'Actual'}

ANALYSIS REQUIREMENTS:
1. Evaluate ${year} ${make} ${model} market reputation
2. Assess ${engineSpecs.turbocharged ? 'turbo' : 'NA'} ${engineSpecs.displacement}L engine vs class standards
3. Analyze ${drivetrainType} impact on utility/value
4. Review ${make} reliability/resale reputation
5. Evaluate market demand for this vintage/config
6. Assess ${transmissionInfo.type?.toLowerCase() || 'transmission'} impact

CONSIDERATIONS:
- Age: ${vehicleAge} years old
- Drivetrain: ${drivetrainType}
- Category: ${vehicleType}${actualMileage ? `
- CRITICAL: Only ${actualMileage.toLocaleString()} miles (${mileageInfo.variance}% below average) - LOW MILEAGE should SIGNIFICANTLY INCREASE values` : ''}

METHODOLOGY:
Use auto.dev data as reference. Apply 2025 market knowledge, condition adjustments (Excellent +15%, Good base, Fair -15%, Poor -25%), regional variations (±5-10%)${actualMileage ? `, and factor actual mileage (${actualMileage.toLocaleString()}) vs expected (${expectedMileage.toLocaleString()})` : ''}. If market conditions suggest different values, provide independent assessment with reasoning.

Respond in JSON:
{"market_values":{"retail_value":{"min":0,"max":0,"suggested_ai_price":0,"desc":"Dealer retail range"},"private_party_value":{"min":0,"max":0,"suggested_ai_price":0,"desc":"Private seller range"},"trade_in_value":{"min":0,"max":0,"suggested_ai_price":0,"desc":"Trade-in range"},"auction_value":{"min":0,"max":0,"suggested_ai_price":0,"desc":"Wholesale range"}},"performance_factors":{"engine_assessment":"Engine performance vs class standards","drivetrain_impact":"${drivetrainType} utility/appeal impact","transmission_preference":"${transmissionInfo.type || 'Trans'} market appeal impact","fuel_economy_impact":"Fuel efficiency vs class priorities"},"market_analysis":{"demand_level":"${make} ${model} current demand","price_trend":"${vehicleType} market trends","seasonal_factors":"Seasonal demand patterns","regional_variations":"Geographic demand variations"},"risk_factors":{"maintenance_costs":"Expected maintenance costs","reliability_outlook":"${make} ${model} reliability assessment","parts_availability":"Parts availability/cost","age_concerns":"${vehicleAge}-year vehicle concerns"},"recommendations":{"selling_strategy":"Optimal selling approach","timing_advice":"Best timing for sale","negotiation_points":"Key value drivers","documentation_needed":"Required documentation"},"confidence_assessment":{"data_quality":"${vehicleData.pricing?.usedTmvRetail ? 'High - baseline available' : 'Medium - limited data'}","market_volatility":"2025 market stability assessment","valuation_accuracy":"Accuracy range estimate","baseline_variance":"Explain valuation differences vs baseline","market_factors":"Key 2025 conditions affecting assessment"}}

GUIDELINES:
1. Provide 2025 values using comprehensive market knowledge
2. Baseline: Retail $${vehicleData.pricing?.usedTmvRetail}, Private $${vehicleData.pricing?.usedPrivateParty}, Trade $${vehicleData.pricing?.usedTradeIn}${vehicleData.pricing?.baseMsrp ? `, MSRP $${vehicleData.pricing.baseMsrp}` : ''}
3. Adjust for current conditions with clear reasoning
4. Consider 2025 factors: inflation, EV impact, buyer preferences${actualMileage ? `
5. CRITICAL: ${actualMileage.toLocaleString()} miles (${mileageInfo.variance}% below average) should SIGNIFICANTLY increase values` : ''}
${actualMileage ? '6' : '5'}. Explain significant baseline differences`;
};


// *********************************************************************************
// Market Informed Helpers and Validators
// *********************************************************************************

// Helper function to fetch current market data
const getMarketContext = async (year, make, model, trim) => {
  // This would integrate with real market data APIs
  // Example integrations:
  
  // Option 1: Cars.com API for current listings
  // const listingsData = await fetch(`https://api.cars.com/v1/listings?year=${year}&make=${make}&model=${model}`);
  
  // Option 2: Edmunds API for valuations
  // const edmundsData = await fetch(`https://api.edmunds.com/v1/valuations/${year}/${make}/${model}`);
  
  // Option 3: AutoTrader API for market data
  // const autotraderData = await fetch(`https://api.autotrader.com/listings?year=${year}&make=${make}&model=${model}`);
  
  return {
    averagePrice: null, // Would come from API
    minPrice: null,
    maxPrice: null,
    averageDom: null,
    listingCount: null,
    trend: null
  };
};

// *********************************************************************************
// Validation System for AI-generated Vehicle Valuations
// *********************************************************************************

const validateAIValuation = (aiValuation, vehicleData, marketBenchmarks = null) => {
  const validation = {
    isValid: true,
    warnings: [],
    errors: [],
    confidence: 'high',
    adjustments: {}
  };

  const year = vehicleData.years?.[0]?.year;
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;

  // 1. Sanity checks for value ranges
  const retail = aiValuation.market_values?.retail_value;
  const privateParty = aiValuation.market_values?.private_party_value;
  const tradeIn = aiValuation.market_values?.trade_in_value;

  // Check value hierarchy (retail > private > trade-in)
  if (retail && privateParty && tradeIn) {
    if (retail.min <= privateParty.min || privateParty.min <= tradeIn.min) {
      validation.errors.push('Value hierarchy incorrect: retail should > private party > trade-in');
      validation.isValid = false;
    }

    // Check reasonable spreads
    const retailSpread = (retail.max - retail.min) / retail.min;
    if (retailSpread > 0.3) {
      validation.warnings.push('Retail value spread seems too wide (>30%)');
      validation.confidence = 'medium';
    }
  }

  // 2. Age-based value checks
  if (vehicleAge > 20 && retail?.min > 50000) {
    validation.warnings.push('High value for 20+ year old vehicle - verify if classic/collectible');
  }

  if (vehicleAge < 3 && retail?.max < 15000) {
    validation.warnings.push('Low value for near-new vehicle - check for issues');
  }

  // 3. Performance vehicle specific checks
  const isPerformance = vehicleData.categories?.market?.includes('Performance') || 
                       vehicleData.categories?.market?.includes('Tuner');
  
  if (isPerformance) {
    const horsepower = vehicleData.engine?.horsepower;
    if (horsepower > 300 && retail?.max < 25000 && vehicleAge < 10) {
      validation.warnings.push('High-performance vehicle may be undervalued');
    }
  }

  // 4. Market data validation (if available)
  if (marketBenchmarks) {
    const aiAverage = (retail.min + retail.max) / 2;
    const marketAverage = marketBenchmarks.averagePrice;
    
    if (marketAverage && Math.abs(aiAverage - marketAverage) / marketAverage > 0.25) {
      validation.warnings.push(`AI valuation differs significantly from market average ($${marketAverage})`);
      validation.confidence = 'low';
      
      // Suggest adjustment
      validation.adjustments.suggested_retail = {
        min: Math.round(marketAverage * 0.9),
        max: Math.round(marketAverage * 1.1),
        reason: 'Adjusted to align with current market data'
      };
    }
  }

  // 5. Brand-specific validation
  const make = vehicleData.make?.name?.toLowerCase();
  
  // Luxury brand minimum values
  const luxuryBrands = ['bmw', 'mercedes-benz', 'audi', 'lexus', 'acura', 'infiniti'];
  if (luxuryBrands.includes(make) && vehicleAge < 5 && retail?.min < 20000) {
    validation.warnings.push('Luxury brand vehicle may be undervalued');
  }

  // Economy brand maximum values
  const economyBrands = ['nissan', 'hyundai', 'kia', 'mitsubishi'];
  if (economyBrands.includes(make) && vehicleAge > 8 && retail?.max > 25000) {
    validation.warnings.push('Economy brand vehicle may be overvalued for age');
  }

  // 6. Fuel economy impact validation
  if (vehicleData.mpg) {
    const combinedMPG = (parseInt(vehicleData.mpg.city) + parseInt(vehicleData.mpg.highway)) / 2;
    
    if (combinedMPG > 35 && !aiValuation.performance_factors?.fuel_economy_impact?.includes('efficiency')) {
      validation.warnings.push('High fuel economy not adequately reflected in valuation');
    }
    
    if (combinedMPG < 20 && vehicleAge < 5 && !isPerformance) {
      validation.warnings.push('Poor fuel economy may negatively impact value more than estimated');
    }
  }

  // 7. Transmission preference validation
  const isManual = vehicleData.transmission?.transmissionType === 'MANUAL';
  if (isManual && isPerformance) {
    // Manual transmissions often preferred in performance cars
    if (!aiValuation.performance_factors?.transmission_preference?.includes('enthusiast')) {
      validation.warnings.push('Manual transmission premium for performance vehicle not reflected');
    }
  }

  return validation;
};

// Cross-reference with multiple AI services for consensus
const getValuationConsensus = async (vehicleData, condition) => {
  const prompt = buildVehicleValuationPrompt(vehicleData, condition);
  
  try {
    // Get valuations from multiple AI services
    const claudeValuation = await getClaudeValuation(prompt);
    const grokValuation = await getGrokValuation(prompt);
    
    // Compare results
    const consensus = {
      claude: claudeValuation,
      grok: grokValuation,
      agreement_level: calculateAgreement(claudeValuation, grokValuation),
      recommended_values: null,
      confidence: 'medium'
    };
    
    // If values are close, average them
    if (consensus.agreement_level > 0.85) {
      consensus.recommended_values = averageValuations(claudeValuation, grokValuation);
      consensus.confidence = 'high';
    } else {
      consensus.confidence = 'low';
      console.log('AI valuations differ significantly - manual review recommended');
    }
    
    return consensus;
    
  } catch (error) {
    console.error('Error getting valuation consensus:', error);
    return null;
  }
};

// USED IN getValuationConsensus()
const calculateAgreement = (val1, val2) => {
  if (!val1?.market_values || !val2?.market_values) return 0;
  
  const retail1 = (val1.market_values.retail_value.min + val1.market_values.retail_value.max) / 2;
  const retail2 = (val2.market_values.retail_value.min + val2.market_values.retail_value.max) / 2;
  
  const difference = Math.abs(retail1 - retail2);
  const average = (retail1 + retail2) / 2;
  
  return Math.max(0, 1 - (difference / average));
};

// USED IN getValuationConsensus()
const averageValuations = (val1, val2) => {
  return {
    market_values: {
      retail_value: {
        min: Math.round((val1.market_values.retail_value.min + val2.market_values.retail_value.min) / 2),
        max: Math.round((val1.market_values.retail_value.max + val2.market_values.retail_value.max) / 2),
        description: 'Consensus retail value'
      },
      private_party_value: {
        min: Math.round((val1.market_values.private_party_value.min + val2.market_values.private_party_value.min) / 2),
        max: Math.round((val1.market_values.private_party_value.max + val2.market_values.private_party_value.max) / 2),
        description: 'Consensus private party value'
      },
      trade_in_value: {
        min: Math.round((val1.market_values.trade_in_value.min + val2.market_values.trade_in_value.min) / 2),
        max: Math.round((val1.market_values.trade_in_value.max + val2.market_values.trade_in_value.max) / 2),
        description: 'Consensus trade-in value'
      }
    }
  };
};


module.exports = {
  buildEnhancedReasoningPrompt,
  buildVehicleValuationPrompt,
  getMarketContext,
  validateAIValuation,
  getValuationConsensus,
  calculateAgreement
};