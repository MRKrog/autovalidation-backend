// AI Prompts for vehicle valuation analysis
// Shared between Claude and Grok services

// *********************************************************************************
// Vehicle Valuation Prompts
// *********************************************************************************

// Basic Vehicle Valuation Prompt
const buildVehicleValuationPrompt = (vehicleData, condition = 'good') => {
  return `
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

Additional Guidelines:
- Consider current market trends and economic factors
- Account for regional price variations
- Factor in vehicle reliability and common issues
- Provide realistic negotiation ranges
- Consider seasonal market fluctuations
- Account for fuel efficiency and maintenance costs
`;
};

// Enhanced AI Prompts for vehicle valuation analysis
const buildEnhancedVehicleValuationPrompt = (vehicleData, condition = 'good', marketData = null) => {
  console.log('🔍 Building enhanced vehicle valuation prompt...');
  console.log('🔍 Vehicle data:', vehicleData);

  // Extract detailed specs from API data
  const engineSpecs = vehicleData.engine ? {
    displacement: vehicleData.engine.displacement,
    horsepower: vehicleData.engine.horsepower,
    torque: vehicleData.engine.torque,
    fuelType: vehicleData.engine.fuelType,
    turbocharged: vehicleData.engine.compressorType === 'turbocharger'
  } : {};

  const transmissionInfo = vehicleData.transmission ? {
    type: vehicleData.transmission.transmissionType,
    speeds: vehicleData.transmission.numberOfSpeeds
  } : {};

  return `
You are a professional automotive appraiser with access to current market data. Analyze this vehicle using the provided specifications and market context.

VEHICLE SPECIFICATIONS:
- Year: ${vehicleData.years?.[0]?.year || 'Unknown'}
- Make: ${vehicleData.make?.name || 'Unknown'}
- Model: ${vehicleData.model?.name || 'Unknown'}
- Trim: ${vehicleData.years?.[0]?.styles?.[0]?.trim || 'Base'}
- Engine: ${engineSpecs.displacement}L ${engineSpecs.horsepower}HP ${engineSpecs.turbocharged ? 'Turbo ' : ''}${vehicleData.engine?.configuration || ''} ${vehicleData.engine?.cylinder}-cylinder
- Transmission: ${transmissionInfo.speeds}-speed ${transmissionInfo.type}
- Drivetrain: ${vehicleData.drivenWheels}
- Body Style: ${vehicleData.categories?.vehicleStyle}
- Market Category: ${vehicleData.categories?.market}
- EPA Class: ${vehicleData.categories?.epaClass}
- Fuel Economy: ${vehicleData.mpg?.city}/${vehicleData.mpg?.highway} mpg
- VIN Pattern: ${vehicleData.squishVin}
- Condition: ${condition}

AVAILABLE OPTIONS & FEATURES:
${vehicleData.options?.[0]?.options?.map(opt => `- ${opt.name}: ${opt.description || 'Available'}`).join('\n') || 'Standard equipment only'}

COLOR OPTIONS:
- Exterior: ${vehicleData.colors?.find(c => c.category === 'Exterior')?.options?.map(c => c.name).join(', ') || 'Standard colors'}
- Interior: ${vehicleData.colors?.find(c => c.category === 'Interior')?.options?.map(c => c.name).join(', ') || 'Standard interior'}

${marketData ? `
CURRENT MARKET CONTEXT:
- Average listing price: $${marketData.averagePrice || 'Unknown'}
- Price range: $${marketData.minPrice || 'Unknown'} - $${marketData.maxPrice || 'Unknown'}
- Days on market: ${marketData.averageDom || 'Unknown'} days
- Total listings: ${marketData.listingCount || 'Unknown'}
- Market trend: ${marketData.trend || 'Unknown'}
` : ''}

ANALYSIS REQUIREMENTS:
1. Consider the high-performance nature (${vehicleData.categories?.market})
2. Factor in the ${engineSpecs.turbocharged ? 'turbocharged' : 'naturally aspirated'} engine performance
3. Account for ${vehicleData.drivenWheels} drivetrain advantages
4. Consider reliability factors for ${vehicleData.make?.name} vehicles
5. Evaluate enthusiast market demand for this model

VALUATION METHODOLOGY:
- Base valuation on comparable sales data patterns
- Apply condition adjustments: Excellent (+15%), Good (base), Fair (-15%), Poor (-25%)
- Consider regional market variations (±5-10%)
- Factor in mileage assumptions (12k/year average)
- Account for performance vehicle premiums/discounts

Provide realistic market values in this JSON format:

{
  "market_values": {
    "retail_value": {
      "min": 0,
      "max": 0,
      "description": "Dealer retail price range"
    },
    "private_party_value": {
      "min": 0,
      "max": 0, 
      "description": "Private seller realistic range"
    },
    "trade_in_value": {
      "min": 0,
      "max": 0,
      "description": "Dealer trade-in offer range"
    },
    "auction_value": {
      "min": 0,
      "max": 0,
      "description": "Wholesale/auction expected range"
    }
  },
  "performance_factors": {
    "engine_premium": "${engineSpecs.horsepower > 250 ? 'High-performance engine adds value' : 'Standard performance impact'}",
    "drivetrain_impact": "${vehicleData.drivenWheels === 'all wheel drive' ? 'AWD adds 5-8% premium' : 'Standard drivetrain'}",
    "transmission_preference": "${transmissionInfo.type === 'MANUAL' ? 'Manual transmission preferred by enthusiasts' : 'Automatic transmission broader appeal'}",
    "fuel_economy_impact": "${vehicleData.mpg ? (parseInt(vehicleData.mpg.combined) > 25 ? 'Good fuel economy helps value' : 'Performance focus may impact efficiency concerns') : 'Unknown efficiency impact'}"
  },
  "market_analysis": {
    "demand_level": "Based on performance category and specs",
    "price_trend": "Consider current market conditions",
    "seasonal_factors": "Performance vehicles often see spring/summer premiums",
    "regional_variations": "Performance cars popular in certain regions"
  },
  "risk_factors": {
    "maintenance_costs": "${vehicleData.engine?.compressorType ? 'Turbocharged engines require premium maintenance' : 'Standard maintenance expectations'}",
    "reliability_outlook": "Based on ${vehicleData.make?.name} historical data",
    "parts_availability": "Consider age and production volume",
    "modification_concerns": "Performance vehicles often modified - affects value"
  },
  "recommendations": {
    "selling_strategy": "Best practices for this vehicle type",
    "timing_advice": "Optimal selling season and conditions",
    "negotiation_points": "Key value drivers to highlight",
    "documentation_needed": "Service records, modification history"
  },
  "confidence_assessment": {
    "data_quality": "High/Medium/Low based on available information",
    "market_volatility": "Performance vehicle market stability",
    "valuation_accuracy": "Expected accuracy range ±X%"
  }
}

IMPORTANT: Provide realistic dollar amounts based on actual market knowledge for ${vehicleData.years?.[0]?.year} ${vehicleData.make?.name} ${vehicleData.model?.name} vehicles. Do not fabricate specific prices - use market knowledge and comparable vehicle patterns.
`;
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

// Enhanced function that combines vehicle data with market data
const buildMarketInformedValuation = async (vehicleData, condition = 'good') => {
  const year = vehicleData.years?.[0]?.year;
  const make = vehicleData.make?.name;
  const model = vehicleData.model?.name;
  const trim = vehicleData.years?.[0]?.styles?.[0]?.trim;
  
  try {
    const marketData = await getMarketContext(year, make, model, trim);
    return buildEnhancedVehicleValuationPrompt(vehicleData, condition, marketData);
  } catch (error) {
    console.log('Market data unavailable, using vehicle specs only');
    return buildEnhancedVehicleValuationPrompt(vehicleData, condition);
  }
};

// Validation system for AI-generated vehicle valuations
// Helps ensure accuracy and catch unrealistic estimates

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
  const prompt = buildEnhancedVehicleValuationPrompt(vehicleData, condition);
  
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

// *********************************************************************************
// Consensus Calculation and Validation
// *********************************************************************************

const calculateAgreement = (val1, val2) => {
  if (!val1?.market_values || !val2?.market_values) return 0;
  
  const retail1 = (val1.market_values.retail_value.min + val1.market_values.retail_value.max) / 2;
  const retail2 = (val2.market_values.retail_value.min + val2.market_values.retail_value.max) / 2;
  
  const difference = Math.abs(retail1 - retail2);
  const average = (retail1 + retail2) / 2;
  
  return Math.max(0, 1 - (difference / average));
};

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
  buildEnhancedVehicleValuationPrompt,
  buildMarketInformedValuation,
  getMarketContext,
  buildVehicleValuationPrompt,
  validateAIValuation,
  getValuationConsensus,
  calculateAgreement
};