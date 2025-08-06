// Test responses for development without hitting Claude API
const MOCK_RESPONSES = {
  'JF1GR8H6XBL831881': {
    "success": true,
    "timestamp": "2025-08-05T04:57:04.945Z",
    "vin": "JF1GR8H6XBL831881",
    "condition": "good",
    "vehicle": {
      "year": 2011,
      "make": "Subaru",
      "model": "Impreza",
      "trim": "WRX STI",
      "body_style": "Hatchback",
      "engine": {
        "displacement": 2.5,
        "horsepower": 305,
        "torque": 290,
        "cylinders": 4,
        "configuration": "flat",
        "fuel_type": "premium unleaded (required)",
        "turbo": true
      },
      "transmission": {
        "type": "MANUAL",
        "speeds": "6",
        "name": "6M"
      },
      "drivetrain": "all wheel drive",
      "fuel_economy": {
        "highway": "23",
        "city": "17"
      },
      "doors": 4,
      "vehicle_size": "Compact",
      "epa_class": "Midsize Station Wagons",
      "original_pricing": {
        "msrp": 35995,
        "invoice": 34029,
        "delivery_charges": 725
      }
    },
    "analysis": {
      "market_values": {
        "retail_value": {
          "min": 22000,
          "max": 26000,
          "suggested_ai_price": 24000,
          "description": "AI-determined dealer retail price range for good condition",
          "baseline_comparison": "My value is significantly higher than the baseline $14403 because the baseline likely uses outdated data that doesn't fully account for the 52% below-average mileage (80,000 vs 168,000 expected), which makes this vehicle rare and highly desirable in 2025. Additionally, baseline misses 2025 enthusiast demand for manual-transmission performance hatchbacks amid EV shifts, inflating values by 30-40% for low-mile examples; I added ~$9,000 for mileage premium, ~$2,000 for collector trends, and ~$1,500 for inflation adjustments.",
          "confidence_level": "High - Strong market data on STI enthusiast sales in 2025, combined with precise mileage adjustment models, supports this valuation with minimal volatility."
        },
        "private_party_value": {
          "min": 19000,
          "max": 23000,
          "suggested_ai_price": 21000,
          "description": "AI-determined private seller realistic range for good condition",
          "baseline_comparison": "Higher than baseline $12256 due to underestimation of low mileage impact in baseline data; this vehicle's 80,000 miles position it as a premium low-use example, adding ~$7,000 in value. Baseline ignores 2025 trends like rising private sales for manual AWD performance cars among enthusiasts, with EV market pushing demand up 20-25%; I adjusted upward by ~$3,000 for market trends and ~$1,500 for condition/maintenance appeal.",
          "confidence_level": "High - Extensive private sale data from 2025 platforms shows consistent premiums for low-mile STIs, with AI cross-referencing recent transactions."
        },
        "trade_in_value": {
          "min": 16000,
          "max": 19000,
          "suggested_ai_price": 17500,
          "description": "AI-determined dealer trade-in offer range for good condition",
          "baseline_comparison": "Increased from baseline $10702 as baseline fails to weight the low 80,000 miles heavily enough, which dealers value highly for resale potential, adding ~$5,000. In 2025, trade-in values for performance Subarus are up due to supply shortages and collector interest; I factored ~$1,500 for inflation and ~$1,000 for manual transmission appeal, resulting in a 60% uplift overall.",
          "confidence_level": "Medium - Trade-in markets can vary by dealer inventory, but 2025 data trends are reliable; slight uncertainty from regional differences."
        },
        "auction_value": {
          "min": 15000,
          "max": 18000,
          "suggested_ai_price": 16500,
          "description": "AI-determined wholesale/auction expected range",
          "baseline_comparison": "Higher than implied baseline (no direct auction value provided, but inferred from trade-in at $10702) due to baseline's lack of 2025 auction data showing strong bidding for low-mile STIs; low mileage adds ~$4,500 in wholesale appeal, plus ~$1,000 for performance category demand amid EV transitions. My analysis uses recent auction results, adjusting upward by 50% for current trends.",
          "confidence_level": "High - Robust 2025 auction datasets from sources like Manheim and Copart provide clear comparables for low-mile examples."
        }
      },
      "ai_reasoning": {
        "primary_value_drivers": "1. Exceptionally low mileage (80,000 vs 168,000 expected) - major premium for rarity and preserved condition. 2. Enthusiast demand for manual-transmission WRX STI in 2025 collector market. 3. All-wheel drive and turbo performance appeal amid declining new manual options. 4. Good condition with no major issues reported. 5. Inflation and supply chain-driven value increases for used performance vehicles.",
        "baseline_analysis": "Baseline data likely missed the full impact of 52% below-average mileage, treating it as a minor adjustment rather than a rarity premium; it also uses pre-2025 data ignoring EV market shifts boosting ICE performance car values, collector trends for STIs, and inflation (up 10-15% since baseline). Additionally, it undervalues manual transmission appeal to demographics avoiding automatics.",
        "market_position": "In 2025, this low-mile 2011 WRX STI sits as a desirable collector/enthusiast vehicle in a market where new performance hatchbacks are scarce due to EV focus; high demand from rally fans and young buyers positions it above average depreciation curves, with values holding or appreciating slightly.",
        "pricing_strategy": "Aggressive - I applied upward adjustments supported by 2025 sales data showing 30-50% premiums for low-mile STIs; conservative on upper ranges to account for age-related risks, but overall optimistic due to strong enthusiast bidding wars.",
        "key_differentiators": "AI valuation incorporates real-time 2025 trends (e.g., EV impact increasing ICE demand), granular mileage modeling, and cross-referenced auction/private sales data unavailable in baseline; this results in 50-70% higher accuracy by quantifying missed factors like collector premiums."
      },
      "detailed_adjustments": {
        "mileage_impact": "Low 80,000 miles vs 168,000 expected adds $6,000-$8,000 across categories; this rarity reduces wear concerns, boosting retail by $9,000 (dealer markup for low-use appeal), private by $7,000 (buyer willingness to pay), trade-in by $5,000 (resale potential), and auction by $4,500 (bidding competition).",
        "condition_impact": "Good condition (vs average) adds $1,500-$2,500; assumes well-maintained with minor cosmetic wear, enhancing value by $2,000 in retail (presentation), $1,800 in private (trust factor), $1,200 in trade-in (quick turnaround), and $1,000 in auction (fewer deductions).",
        "market_trend_adjustment": "2025 trends: +$2,000 for inflation (10% used car rise), +$1,500 for EV shift boosting ICE performance demand, +$1,000 for collector trends in manual Subarus; total upward adjustment of $4,500 across values to reflect supply constraints and buyer shifts.",
        "brand_premium_discount": "Subaru premium: +$1,000 for strong AWD/reliability reputation in performance segment; no discount as 2025 data shows STIs outperforming peers due to rally heritage and parts availability.",
        "total_adjustment": "+$8,000-$10,000 from baseline retail (to $24,000 suggested) driven by mileage ($9,000) dominating, plus trends/condition ($3,500 total); similar scaling for others - reasoning: baseline outdated, my AI uses 2025 comps for precision."
      },
      "performance_factors": {
        "engine_assessment": "The 2.5L 305HP turbo flat-4 exceeds class standards for compact performance hatchbacks, offering rally-inspired power; in 2025, it remains appealing to enthusiasts despite age, with market expectations favoring its tunable nature over newer, less modifiable EVs.",
        "drivetrain_impact": "Standard AWD enhances utility in all-weather conditions, boosting appeal and value by 10-15% in 2025 markets where buyers prioritize versatility; it positions the vehicle as a practical high-performance option amid declining AWD availability in new cars.",
        "transmission_preference": "Manual 6-speed appeals strongly to enthusiast demographics (e.g., millennials/gen-Z drivers), adding 5-10% value premium; however, it may limit broader appeal in a market shifting to automatics, though 2025 data shows manual STIs commanding higher prices in private/auction sales.",
        "fuel_economy_impact": "17/23 mpg (combined 20) is below 2025 class averages (25-30 mpg for compacts), negatively impacting value by ~$500 in efficiency-conscious markets; but performance buyers overlook this, with EV trends ironically highlighting its 'fun' inefficiency as a draw."
      },
      "market_analysis": {
        "demand_level": "High demand for Subaru Impreza WRX STI due to its rally reputation and as a factory tuner; vehicle type (performance hatchback) sees strong enthusiast interest in 2025, with low-mile examples fetching premiums amid limited new alternatives.",
        "price_trend": "Car market trends show stabilization with slight appreciation for performance models; Subaru-specific factors like AWD loyalty and tuning community drive 5-10% annual value increases, countering general depreciation through collector status.",
        "seasonal_factors": "Demand peaks in spring/summer for performance driving seasons, adding 5-10% value; winter may see slight dips due to AWD appeal in snow regions, but overall stable for year-round utility.",
        "regional_variations": "Higher demand in Northeast/Midwest (AWD for weather) and West Coast (tuning culture), potentially +10-15% values; lower in Sunbelt regions where performance cars compete with EVs, but national average favors upward adjustment."
      },
      "risk_factors": {
        "maintenance_costs": "Moderate-high expected costs for turbo engine (e.g., $1,000-$2,000/year for timing belts/turbo service); age and brand reputation suggest reliable but parts-intensive upkeep, mitigated by low mileage.",
        "reliability_outlook": "Subaru Impreza STI has solid reliability per 2025 data, with head gasket issues historical but resolved in later models; low miles improve outlook, rating above average for 14-year-old performance cars.",
        "parts_availability": "Good availability through Subaru's network and aftermarket; costs moderate ($500-$1,500 for common parts), supported by strong enthusiast community presence in 2025.",
        "age_concerns": "14-year-old vehicle risks include electronics degradation and rust in certain climates; however, low mileage and good condition minimize these, with value holding via collector appeal."
      },
      "recommendations": {
        "selling_strategy": "Target enthusiast platforms like Bring a Trailer or Subaru forums for private sale to maximize low-mileage premium; avoid trade-in if possible, as private yields 20% more.",
        "timing_advice": "Sell in spring (March-May) when performance car demand surges with driving season; avoid winter unless in AWD-heavy regions to capitalize on seasonal peaks.",
        "negotiation_points": "Emphasize 52% below-average mileage, manual transmission rarity, and turbo performance; highlight service records and condition to justify 10-15% above asking.",
        "documentation_needed": "Full service history, mileage verification (e.g., Carfax), recent inspection report, and original window sticker to build buyer confidence and support premium pricing."
      },
      "confidence_assessment": {
        "data_quality": "High - baseline market data available",
        "market_volatility": "Low volatility for performance Subarus in 2025; stable demand from enthusiasts offsets broader used car fluctuations, with consistent auction results.",
        "valuation_accuracy": "85-95% accuracy estimated; based on comprehensive 2025 data integration, though slight variance from unobservable factors like exact vehicle history.",
        "ai_advantage": "AI analyzes real-time 2025 trends (e.g., EV impact on ICE values) and granular comparables, quantifying low-mileage premiums more precisely than static baseline models.",
        "market_factors": "2025 conditions like inflation (10% used car rise), supply shortages for manuals, and collector boom for STIs heavily influence upward adjustments from baseline."
      }
    },
    "report_id": "DVai-1754369824945",
    "generated_by": "DriveValueAI API v2.0 (Mock Response)"
  },
};

// Helper function to get mock response with condition adjustment
const getMockResponse = (vin, condition = 'good') => {
  const mockResponse = MOCK_RESPONSES[vin];
  if (mockResponse) {
    // Adjust values based on condition
    const adjustedResponse = adjustValuesForCondition(mockResponse, condition);
    
    // Update timestamp to current time
    return {
      ...adjustedResponse,
      timestamp: new Date().toISOString(),
      report_id: `VVP-${Date.now()}`
    };
  }
  return null;
};

// Helper function to adjust values based on condition
const adjustValuesForCondition = (response, condition) => {
  const conditionMultipliers = {
    'excellent': 1.12, // +12%
    'good': 1.0,      // Base value
    'fair': 0.88,     // -12%
    'poor': 0.75      // -25%
  };

  const conditionMessages = {
    'excellent': {
      condition_impact: "Excellent condition vehicles command premium prices with minimal negotiation room",
      negotiation_points: "Highlight pristine condition, full service history, and showroom-ready appearance",
      overall_assessment: "Premium vehicle in excellent condition with strong market appeal"
    },
    'good': {
      condition_impact: "Well-maintained vehicles command higher prices",
      negotiation_points: "Highlight maintenance and low mileage",
      overall_assessment: "Solid vehicle with stable market outlook"
    },
    'fair': {
      condition_impact: "Fair condition vehicles require price adjustments and may need minor repairs",
      negotiation_points: "Be prepared to address condition issues and consider repair costs in pricing",
      overall_assessment: "Functional vehicle with some wear, priced accordingly"
    },
    'poor': {
      condition_impact: "Poor condition significantly impacts value and may require major repairs",
      negotiation_points: "Price should reflect significant repair needs and limited market appeal",
      overall_assessment: "Vehicle in poor condition with limited market value"
    }
  };

  // Special handling for performance vehicles like the Subaru WRX STI
  const isPerformanceVehicle = (response) => {
    const vin = response.vin;
    const vehicle = response.vehicle;
    return vin === 'JF1GR8H6XBL831881' || 
           (vehicle?.categories?.market?.includes('High-Performance') || 
            vehicle?.engine_specs?.horsepower > 250);
  };

  const performanceConditionMessages = {
    'excellent': {
      condition_impact: "Excellent condition performance vehicles command significant premiums in the enthusiast market",
      negotiation_points: "Emphasize pristine condition, documented maintenance, and lack of modifications",
      overall_assessment: "Premium performance vehicle in excellent condition with strong enthusiast appeal"
    },
    'good': {
      condition_impact: "Well-maintained performance vehicles maintain strong value in the enthusiast market",
      negotiation_points: "Highlight performance features, maintenance history, and any factory options",
      overall_assessment: "Solid performance vehicle with stable enthusiast market value"
    },
    'fair': {
      condition_impact: "Fair condition performance vehicles may need repairs but still appeal to enthusiasts",
      negotiation_points: "Be transparent about condition issues; performance buyers may accept some wear",
      overall_assessment: "Functional performance vehicle with some wear, still appealing to enthusiasts"
    },
    'poor': {
      condition_impact: "Poor condition significantly impacts performance vehicle value; may need major repairs",
      negotiation_points: "Price should reflect repair needs; performance vehicles are expensive to fix",
      overall_assessment: "Performance vehicle in poor condition with limited market value"
    }
  };

  const multiplier = conditionMultipliers[condition] || 1.0;
  const isPerformance = isPerformanceVehicle(response);
  const messages = isPerformance ? 
    (performanceConditionMessages[condition] || performanceConditionMessages['good']) :
    (conditionMessages[condition] || conditionMessages['good']);
  
  // Deep clone the response
  const adjustedResponse = JSON.parse(JSON.stringify(response));
  
  // Adjust market values
  if (adjustedResponse.analysis && adjustedResponse.analysis.market_values) {
    const marketValues = adjustedResponse.analysis.market_values;
    
    Object.keys(marketValues).forEach(key => {
      if (marketValues[key].min && marketValues[key].max) {
        marketValues[key].min = Math.round(marketValues[key].min * multiplier);
        marketValues[key].max = Math.round(marketValues[key].max * multiplier);
      }
    });
  }

  // Update condition-specific messaging based on vehicle type
  if (adjustedResponse.analysis) {
    if (adjustedResponse.analysis.key_factors) {
      adjustedResponse.analysis.key_factors.condition_impact = messages.condition_impact;
    }
    if (adjustedResponse.analysis.strategic_recommendations) {
      adjustedResponse.analysis.strategic_recommendations.negotiation_points = messages.negotiation_points;
    }
    if (adjustedResponse.analysis.summary) {
      adjustedResponse.analysis.summary.overall_assessment = messages.overall_assessment;
    }
    
    // For enhanced responses with performance_factors, update those too
    if (adjustedResponse.analysis.performance_factors) {
      if (isPerformance) {
        adjustedResponse.analysis.performance_factors.condition_impact = messages.condition_impact;
      }
    }
    
    // For enhanced responses with recommendations, update those too
    if (adjustedResponse.analysis.recommendations) {
      adjustedResponse.analysis.recommendations.negotiation_points = messages.negotiation_points;
    }
  }

  // Update condition in the response
  adjustedResponse.condition = condition;
  
  return adjustedResponse;
};

// Helper function to check if VIN has a mock response
const hasMockResponse = (vin) => {
  return !!MOCK_RESPONSES[vin];
};

module.exports = {
  MOCK_RESPONSES,
  getMockResponse,
  hasMockResponse
}; 