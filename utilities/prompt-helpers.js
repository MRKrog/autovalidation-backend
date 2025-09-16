
/**
 * Safely extracts values from nested objects with defaults
 * @param {Object} obj - The object to extract from
 * @param {string} path - The path to extract (e.g., 'make.name')
 * @param {*} defaultValue - Default value if path not found
 * @returns {*} - The extracted value or default
 */
const safeExtract = (obj, path, defaultValue = 'Unknown') => {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : defaultValue), obj);
};

/**
 * Determines mileage info for a vehicle
 * @param {number} actualMileage - Actual mileage of the vehicle
 * @param {number} expectedMileage - Expected mileage of the vehicle
 * @returns {Object} - Mileage info
 */
const determineMileageInfo = (actualMileage, expectedMileage) => {
  return actualMileage 
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
}

module.exports = { 
  safeExtract,
  determineMileageInfo
};


  // Vehicle data: {
  //   vin: 'JF1GR8H6XBL831881',
  //   year: 2011,
  //   make: { name: 'Subaru', id: 'JF1', niceName: 'Subaru' },
  //   model: { name: 'Impreza', id: 'Impreza', niceName: 'Impreza' },
  //   trim: 'WRX STI',
  //   fullStyleDescription: '4dr Hatchback AWD',
  //   bodyStyle: { body: '4dr Hatchback AWD', modelName: 'Impreza' },
  //   specifications: { type: 'Passenger Car', origin: 'Japan' },
  //   metadata: {
  //     manufacturerCode: 'JF1',
  //     squishVin: 'JF1GR8H6BL',
  //     vinValid: true,
  //     checkDigit: 'X',
  //     checksum: true,
  //     manufacturer: 'Subaru Corporation'
  //   }
  // }

  // AI Analysis:
  // {
  //   market_values: {
  //     retail_value: {
  //       min: 22000,
  //       max: 25000,
  //       suggested_ai_price: 23500,
  //       description: 'AI-determined dealer retail price range for good condition',
  //       market_analysis: "The 2011 Subaru Impreza WRX STI is a highly desirable performance-oriented model with all-wheel drive. Despite its age, the WRX STI maintains strong demand in the used car market, especially among enthusiasts. The low mileage of 80,000 miles is a significant value driver, as it is 58% below the average for a 14-year-old vehicle. This low mileage, combined with the model's reputation for reliability and performance, supports a retail value in the $22,000 to $25,000 range, with a suggested AI price of $23,500.",
  //       confidence_level: 'High - The Subaru WRX STI is a well-known and sought-after performance model, and the low mileage is a strong positive factor. The retail value range is supported by recent sales data and market trends.'
  //     },
  //     private_party_value: {
  //       min: 19000,
  //       max: 22000,
  //       suggested_ai_price: 20500,
  //       description: 'AI-determined private seller realistic range for good condition',
  //       market_analysis: 'For a private party sale, the 2011 Subaru Impreza WRX STI in good condition with 80,000 miles would likely sell in the range of $19,000 to $22,000, with a suggested AI price of $20,500. Private party values are typically lower than retail, as buyers expect a discount for handling the sale themselves. However, the desirability of the WRX STI model and the low mileage help maintain a relatively high private party value range.',
  //       confidence_level: "High - The private party value range is supported by recent sales data and market trends, taking into account the vehicle's condition, mileage, and demand."
  //     },
  //     trade_in_value: {
  //       min: 16000,
  //       max: 18000,
  //       suggested_ai_price: 17000,
  //       description: 'AI-determined dealer trade-in offer range for good condition',
  //       market_analysis: 'For a dealer trade-in, the 2011 Subaru Impreza WRX STI in good condition with 80,000 miles would likely receive an offer in the range of $16,000 to $18,000, with a suggested AI price of $17,000. Trade-in values are typically lower than private party or retail, as dealers need to account for reconditioning costs and profit margins. However, the desirable nature of the WRX STI model and the low mileage help maintain a relatively high trade-in value range.',
  //       confidence_level: "High - The trade-in value range is supported by recent sales data and market trends, taking into account the vehicle's condition, mileage, and demand."
  //     },
  //     auction_value: {
  //       min: 14000,
  //       max: 16000,
  //       suggested_ai_price: 15000,
  //       description: 'AI-determined wholesale/auction expected range',
  //       market_analysis: 'At wholesale or auction, the 2011 Subaru Impreza WRX STI in good condition with 80,000 miles would likely sell in the range of $14,000 to $16,000, with a suggested AI price of $15,000. Auction and wholesale values are typically lower than retail or private party, as these transactions are focused on volume and efficiency rather than maximizing individual vehicle value. However, the desirability of the WRX STI model and the low mileage help maintain a relatively high auction value range.',
  //       confidence_level: "High - The auction value range is supported by recent sales data and market trends, taking into account the vehicle's condition, mileage, and demand."
  //     }
  //   },
  //   key_insights: {
  //     rarity_factors: "The 2011 Subaru Impreza WRX STI is a relatively rare and desirable model, as it was the last year of production for the hatchback body style. According to Subaru's production history, the 2011 model year saw a significant reduction in overall Impreza production compared to previous years, making this a more limited and sought-after version.",
  //     market_callouts: "The used car market in 2025 is expected to see continued demand for performance-oriented vehicles like the Subaru WRX STI, despite the industry's shift towards electric vehicles. However, supply chain issues and inflation are likely to put upward pressure on prices for desirable used models. Additionally, the Impreza's all-wheel-drive configuration is expected to maintain strong appeal in regions with harsh winter weather conditions.",
  //     value_enhancers: "The low mileage of 80,000 miles, which is 58% below the average for a 14-year-old vehicle, is a significant value enhancer. The Subaru WRX STI's reputation for reliability and performance also contribute to its desirability in the used car market, further supporting its value."
  //   },
  //   ai_reasoning: {
  //     primary_value_drivers: '1. Low mileage (80,000 miles) 2. Desirable performance model (WRX STI) 3. Reputation for reliability and durability 4. Rarity of the 2011 hatchback body style 5. All-wheel-drive configuration',
  //     market_position: "The 2011 Subaru Impreza WRX STI is expected to maintain a strong market position in 2025, as performance-oriented vehicles continue to be in demand despite the industry's shift towards electric vehicles. The low mileage and desirable features of this model make it a sought-after choice among enthusiasts and buyers in regions with harsh winter weather conditions.",
  //     pricing_strategy: 'The pricing strategy for this vehicle is moderately aggressive, as the low mileage and desirable features justify a higher valuation. However, the age of the vehicle and potential for increased maintenance costs warrant a slightly conservative approach to ensure the valuation remains realistic and competitive in the market.',
  //     key_differentiators: 'The key differentiators of this AI-powered automotive appraisal are the comprehensive market analysis, the consideration of 2025 trends and factors, and the ability to quantify the impact of specific vehicle characteristics, such as mileage and rarity. This analysis provides a detailed and evidence-based valuation that takes into account both the current market conditions and the expected future trends.'
  //   },
  //   detailed_adjustments: {
  //     mileage_impact: 'The low mileage of 80,000 miles, which is 58% below the average for a 14-year-old vehicle, adds approximately $2,500 to $3,000 in value compared to a vehicle with average mileage of 189,000 miles.',
  //     condition_impact: 'The good condition of the vehicle adds approximately $1,000 to $1,500 in value compared to an average condition vehicle.',
  //     market_trend_adjustment: 'The expected increase in demand for performance-oriented vehicles like the Subaru WRX STI, combined with the potential for supply chain issues and inflation, adds an estimated $1,000 to $1,500 in value.',
  //     brand_premium_discount: "Subaru's reputation for reliability and the WRX STI's performance heritage add a premium of approximately $1,000 to $1,500 in value.",
  //     total_adjustment: 'The total value adjustments, including mileage, condition, market trends, and brand factors, add approximately $6,000 to $7,500 to the base value of the vehicle.'
  //   },
  //   performance_factors: {
  //     engine_assessment: "The 2.5-liter turbocharged Boxer engine in the 2011 Subaru Impreza WRX STI is known for its impressive performance and durability. This engine delivers 305 horsepower and 290 lb-ft of torque, which is significantly more than the standard Impreza model. The WRX STI's performance capabilities are well above the class average and continue to be highly sought after by enthusiasts.",
  //     fuel_economy_impact: "The 2011 Subaru Impreza WRX STI has a fuel economy rating of 17 mpg city and 23 mpg highway, which is lower than the average for the Passenger Car class. However, the performance-oriented nature of the vehicle and the target market's priorities mean that fuel efficiency is not a primary consideration for this model."
  //   },
  //   market_analysis: {
  //     demand_level: "The demand for the 2011 Subaru Impreza WRX STI is expected to remain high in 2025, as performance-oriented vehicles continue to be sought after by enthusiasts and buyers in regions with harsh winter weather conditions. The WRX STI's reputation for reliability and its all-wheel-drive configuration contribute to its desirability.",
  //     price_trend: 'The Passenger Car market is expected to see moderate price increases in 2025 due to inflation and supply chain issues. However, the Subaru Impreza WRX STI is likely to maintain a premium pricing position within the segment, as its performance capabilities and desirable features set it apart from more mainstream models.',
  //     seasonal_factors: "Demand for the Subaru Impreza WRX STI is typically higher during the fall and winter months, as buyers in regions with harsh winter weather conditions seek out the vehicle's all-wheel-drive capabilities. This seasonal demand pattern is expected to continue in 2025.",
  //     regional_variations: 'The Subaru Impreza WRX STI is expected to have stronger demand in regions with harsh winter weather conditions, such as the Northeast and Midwest United States, where the all-wheel-drive configuration is highly valued. Demand may be lower in warmer regions where the performance-oriented features are less of a priority.'
  //   },
  //   risk_factors: {
  //     maintenance_costs: 'The 2011 Subaru Impreza WRX STI is known for its reliability and durability, but as a 14-year-old vehicle, it may require more frequent and potentially more expensive maintenance. Parts availability and labor costs for this model may be higher than for more mainstream vehicles.',
  //     reliability_outlook: 'The Subaru Impreza WRX STI has a reputation for reliability, and the low mileage of this particular vehicle suggests that it has been well-maintained. However, as the vehicle ages, the risk of unexpected breakdowns or issues may increase, which should be considered by potential buyers.',
  //     parts_availability: 'As a relatively niche and performance-oriented model, the availability and cost of replacement parts for the 2011 Subaru Impreza WRX STI may be higher than for more common vehicles. This could impact the long-term ownership costs for this vehicle.',
  //     age_concerns: 'At 14 years old, the 2011 Subaru Impreza WRX STI is approaching the upper end of the typical used car age range. While the low mileage and good condition help mitigate some age-related concerns, buyers should be aware of the potential for increased maintenance and repair costs as the vehicle continues to age.'
  //   },
  //   recommendations: {
  //     selling_strategy: 'For this 2011 Subaru Impreza WRX STI, the optimal selling strategy would be to target the enthusiast market, either through private party sales or through a specialized dealer that caters to performance vehicle enthusiasts. The low mileage and desirable features of this model make it an attractive option for buyers seeking a well-maintained and rare performance vehicle.',
  //     timing_advice: 'The best time to sell this vehicle would be during the fall and winter months, when demand for all-wheel-drive performance vehicles is typically highest. This would allow the seller to capitalize on the seasonal demand patterns and potentially achieve a higher selling price.',
  //     negotiation_points: 'Key negotiation points for this vehicle include the low mileage, the desirable performance features, and the rarity of the 2011 hatchback body style. Sellers should be prepared to highlight these value drivers and justify the pricing based on the comprehensive market analysis and 2025 trends.',
  //     documentation_needed: "To maximize the value and buyer confidence, the seller should provide a complete service history, any available maintenance records, and a vehicle history report. Additionally, any documentation related to the vehicle's rarity or limited production status would be valuable in the sales process."
  //   },
  //   confidence_assessment: {
  //     data_quality: 'Medium - The limited vehicle data and lack of baseline pricing information introduce some uncertainty, but the comprehensive market analysis and tools used to research recent sales data and trends help mitigate these limitations.',
  //     market_volatility: "The 2025 market is expected to be moderately volatile, with factors like inflation, supply chain issues, and the industry's shift towards electric vehicles creating some uncertainty. However, the strong demand for performance-oriented vehicles like the Subaru WRX STI is expected to help stabilize the market for this specific model.",
  //     valuation_accuracy: "The valuation accuracy is expected to be in the range of +/- 5-10%, based on the available data and the AI's ability to analyze market trends and vehicle-specific factors.",
  //     ai_advantage: 'The AI-powered automotive appraisal provides a significant advantage in terms of comprehensive market knowledge, the ability to analyze 2025 trends, and the quantification of specific value drivers like mileage and rarity. This level of detailed analysis and reasoning is not typically available from traditional valuation methods.',
  //     market_factors: "The key 2025 market factors influencing the valuation of this 2011 Subaru Impreza WRX STI include inflation, supply chain issues, the industry's shift towards electric vehicles, and regional variations in demand for performance-oriented all-wheel-drive vehicles."
  //   },
  //   validation: {
  //     is_valid: true,
  //     confidence: 'high',
  //     warnings: [],
  //     errors: [],
  //     suggested_adjustments: {}
  //   }
  // }