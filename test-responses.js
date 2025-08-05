// Test responses for development without hitting Claude API
const MOCK_RESPONSES = {
  '1G1ZD5ST8JF134138': {
    "success": true,
    "timestamp": "2025-08-03T01:46:04.242Z",
    "vin": "1G1ZD5ST8JF134138",
    "condition": "good",
    "vehicle": {
      "year": 2018,
      "make": "Chevrolet",
      "model": "Malibu",
      "engine": "Lfv",
      "transmission": "6A",
      "made_in": "Unknown",
      "msrp": "Unknown"
    },
    "analysis": {
      "market_values": {
        "retail_value": {
          "min": 14500,
          "max": 16800,
          "description": "Dealer lot price"
        },
        "private_party_value": {
          "min": 13200,
          "max": 15300,
          "description": "Individual seller price"
        },
        "trade_in_value": {
          "min": 11800,
          "max": 13500,
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
        "resale_outlook": "45-55% value retention after 5 years"
      },
      "strategic_recommendations": {
        "best_time": "Current market is favorable",
        "negotiation_points": "Highlight maintenance and low mileage",
        "market_positioning": "Competitive against Honda Accord and Toyota Camry"
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
    },
    "report_id": "VVP-1754185564242",
    "generated_by": "VinValuation Pro API v1.0"
  },
  
  '1HGBH41JXMN109186': {
    "success": true,
    "timestamp": "2025-08-03T01:46:04.242Z",
    "vin": "1HGBH41JXMN109186",
    "condition": "good",
    "vehicle": {
      "year": 2021,
      "make": "Honda",
      "model": "Civic",
      "engine": "1.5L Turbo",
      "transmission": "CVT",
      "made_in": "USA",
      "msrp": "Unknown"
    },
    "analysis": {
      "market_values": {
        "retail_value": {
          "min": 18500,
          "max": 20800,
          "description": "Dealer lot price"
        },
        "private_party_value": {
          "min": 16000,
          "max": 18500,
          "description": "Individual seller price"
        },
        "trade_in_value": {
          "min": 15000,
          "max": 17000,
          "description": "Dealer trade value"
        }
      },
      "market_analysis": {
        "demand_level": "Medium-High",
        "price_trend": "Stable with slight upward trend",
        "regional_variations": "Coastal regions may see higher prices"
      },
      "key_factors": {
        "condition_impact": "Well-maintained vehicles command higher prices",
        "mileage_considerations": "Average 12,000 miles per year expected",
        "common_issues": "Minor recalls addressed by manufacturer",
        "resale_outlook": "45-55% value retention after 5 years"
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
    },
    "report_id": "VVP-1754185564243",
    "generated_by": "VinValuation Pro API v1.0"
  },
  
  '1FTFW1ET5DFC10312': {
    "success": true,
    "timestamp": "2025-08-03T01:46:04.242Z",
    "vin": "1FTFW1ET5DFC10312",
    "condition": "good",
    "vehicle": {
      "year": 2013,
      "make": "Ford",
      "model": "F-150",
      "engine": "3.5L V6 EcoBoost",
      "transmission": "6-Speed Automatic",
      "made_in": "USA",
      "msrp": "Unknown"
    },
    "analysis": {
      "market_values": {
        "retail_value": {
          "min": 16500,
          "max": 18200,
          "description": "Dealer lot price"
        },
        "private_party_value": {
          "min": 14000,
          "max": 16000,
          "description": "Individual seller price"
        },
        "trade_in_value": {
          "min": 12500,
          "max": 14000,
          "description": "Dealer trade value"
        }
      },
      "market_analysis": {
        "demand_level": "High",
        "price_trend": "Stable with slight upward trend",
        "regional_variations": "Coastal regions and areas with active construction industries may see higher prices"
      },
      "key_factors": {
        "condition_impact": "Well-maintained vehicles in excellent condition can command higher prices",
        "mileage_considerations": "Average 12,000 to 15,000 miles per year expected for this model",
        "common_issues": "Some minor recalls related to electrical components have been addressed by the manufacturer",
        "resale_outlook": "45-55% value retention after 5 years"
      },
      "strategic_recommendations": {
        "best_time": "Current market conditions are favorable for both buyers and sellers",
        "negotiation_points": "Highlight maintenance history, low mileage, and any additional features or upgrades",
        "market_positioning": "Competitive against other full-size pickup trucks like the Chevrolet Silverado and Ram 1500"
      },
      "risk_assessment": {
        "reliability_concerns": "Generally reliable with few major issues reported, though some owners have experienced minor electrical problems",
        "depreciation_outlook": "Average depreciation rates, with higher resale values compared to similar-sized competitors",
        "market_saturation": "Balanced supply and demand, with some regional variations"
      },
      "summary": {
        "overall_assessment": "The 2013 Ford F-150 is a solid, reliable, and well-regarded full-size pickup truck with a stable market outlook. It is a good choice for both personal and commercial use.",
        "recommended_action": "This is a good time to buy or sell the 2013 Ford F-150, as the market conditions are favorable.",
        "confidence_level": "High"
      }
    },
    "report_id": "VVP-1754185564244",
    "generated_by": "VinValuation Pro API v1.0"
  },
  
  // Subaru WRX STI
  'JF1GR8H6XBL831881': {
    "success": true,
    "timestamp": "2025-08-04T16:35:02.523Z",
    "vin": "JF1GR8H6XBL831881",
    "condition": "good",
    "vehicle": {
      "year": 2011,
      "make": "Subaru",
      "model": "Impreza",
      "engine_specs": {
        "id": "200347391",
        "name": "Engine",
        "equipmentType": "ENGINE",
        "availability": "STANDARD",
        "compressionRatio": 8.2,
        "cylinder": 4,
        "size": 2.5,
        "displacement": 2457,
        "configuration": "flat",
        "fuelType": "premium unleaded (required)",
        "horsepower": 305,
        "torque": 290,
        "totalValves": 16,
        "type": "gas",
        "code": "4HTCG2.5",
        "compressorType": "turbocharger",
        "rpm": {
          "horsepower": 6000,
          "turbo": 4000
        },
        "valve": {
          "timing": "variable valve timing",
          "gear": "double overhead camshaft"
        }
      },
      "transmission_specs": {
        "id": "200347392",
        "name": "6M",
        "equipmentType": "TRANSMISSION",
        "availability": "STANDARD",
        "transmissionType": "MANUAL",
        "numberOfSpeeds": "6"
      },
      "drivetrain": "all wheel drive",
      "fuel_economy": {
        "highway": "23",
        "city": "17"
      },
      "categories": {
        "primaryBodyType": "Car",
        "market": "Factory Tuner,High-Performance,Hatchback",
        "epaClass": "Midsize Station Wagons",
        "vehicleSize": "Compact",
        "vehicleType": "Car",
        "vehicleStyle": "4dr Hatchback"
      },
      "options": [
        {
          "category": "Interior",
          "options": [
            {
              "id": "200082513",
              "name": "All Weather Floor Mats",
              "equipmentType": "OPTION",
              "availability": "All"
            },
            {
              "id": "200082537",
              "name": "Popular Equipment Group 3A",
              "description": "Auto-dimming rearview mirror with compass; Security system shock sensor",
              "equipmentType": "OPTION",
              "availability": "All"
            }
          ]
        },
        {
          "category": "Exterior",
          "options": [
            {
              "id": "200347646",
              "name": "STI Exhaust Tip Finisher",
              "equipmentType": "OPTION",
              "availability": "WRX Wagon/STI Wagon"
            },
            {
              "id": "200082584",
              "name": "Body Side Molding - Satin White Pearl",
              "equipmentType": "OPTION",
              "availability": "All except Outback Sport"
            }
          ]
        }
      ],
      "colors": [
        {
          "category": "Interior",
          "options": [
            {
              "id": "401638244",
              "name": "Black",
              "equipmentType": "COLOR",
              "availability": "USED"
            }
          ]
        },
        {
          "category": "Exterior",
          "options": [
            {
              "id": "200082499",
              "name": "Dark Gray Metallic",
              "equipmentType": "COLOR",
              "availability": "USED"
            },
            {
              "id": "200347634",
              "name": "Lightning Red",
              "equipmentType": "COLOR",
              "availability": "USED"
            }
          ]
        }
      ],
      "made_in": "Unknown",
      "msrp": "Unknown"
    },
    "analysis": {
      "market_values": {
        "retail_value": {
          "min": 15000,
          "max": 18000,
          "description": "Dealer retail price range"
        },
        "private_party_value": {
          "min": 13000,
          "max": 16000,
          "description": "Private seller realistic range"
        },
        "trade_in_value": {
          "min": 10000,
          "max": 12000,
          "description": "Dealer trade-in offer range"
        },
        "auction_value": {
          "min": 8000,
          "max": 10000,
          "description": "Wholesale/auction expected range"
        }
      },
      "performance_factors": {
        "engine_premium": "High-performance 305HP turbocharged engine adds significant value in the enthusiast market",
        "drivetrain_impact": "AWD adds 5-8% premium due to enhanced traction and appeal in regions with adverse weather",
        "transmission_preference": "6-speed manual transmission highly preferred by enthusiasts, adding to demand",
        "fuel_economy_impact": "17/23 mpg is below average, potentially deterring non-enthusiast buyers but less impactful for performance-focused buyers"
      },
      "market_analysis": {
        "demand_level": "Strong demand in the enthusiast market for the WRX STI due to its rally heritage and performance capabilities",
        "price_trend": "Stable to slightly appreciating for well-maintained examples, as the WRX STI maintains a cult following despite age",
        "seasonal_factors": "Performance vehicles like the WRX STI often see spring/summer premiums due to increased interest in sporty driving",
        "regional_variations": "Higher demand and value in northern and mountainous regions due to AWD capability; urban areas with enthusiast communities also strong"
      },
      "risk_factors": {
        "maintenance_costs": "Turbocharged engines and performance components require premium maintenance; costs can be high for repairs like clutch or turbo replacement",
        "reliability_outlook": "Subaru's historical reliability is generally solid, but the WRX STI's high-stress components may show wear if not properly maintained",
        "parts_availability": "Parts for the 2011 model are still relatively available, though some performance-specific components may be harder to source",
        "modification_concerns": "Performance vehicles like the WRX STI are often modified; non-factory mods can decrease value if poorly executed or undocumented"
      },
      "recommendations": {
        "selling_strategy": "Target enthusiast buyers through platforms like car forums, Subaru-specific groups, or events; highlight condition and maintenance history",
        "timing_advice": "Aim to sell in late spring or early summer when demand for performance cars typically peaks",
        "negotiation_points": "Emphasize the AWD system, turbo performance, manual transmission, and any premium options like navigation or performance packages",
        "documentation_needed": "Provide complete service records, especially for turbo and transmission maintenance; disclose and document any modifications"
      },
      "confidence_assessment": {
        "data_quality": "High, based on historical sales data for 2011 Subaru WRX STI and current market trends for performance hatchbacks",
        "market_volatility": "Moderate volatility in the performance vehicle market; values can fluctuate based on condition and local demand",
        "valuation_accuracy": "Expected accuracy range ±5-7%, assuming mileage is near the 144,000-mile average (12k/year for 12 years) and condition is accurately reported as 'good'"
      },
      "validation": {
        "is_valid": true,
        "confidence": "high",
        "warnings": [],
        "errors": [],
        "suggested_adjustments": {}
      }
    },
    "market_data": null,
    "report_id": "VVP-ENH-1754325302523",
    "generated_by": "VinValuation Pro API v1.1 (Enhanced Premium)"
  }
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