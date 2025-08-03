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

  const multiplier = conditionMultipliers[condition] || 1.0;
  const messages = conditionMessages[condition] || conditionMessages['good'];
  
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

  // Update condition-specific messaging
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