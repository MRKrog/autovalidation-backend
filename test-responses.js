// Test responses for development without hitting Claude API
const MOCK_RESPONSES = {
  '1G1ZD5ST8JF134138': {
    "success": true,
    "timestamp": "2025-08-03T01:46:04.242Z",
    "vin": "1G1ZD5ST8JF134138",
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
    },
    "report_id": "VVP-1754185564242",
    "generated_by": "VinValuation Pro API v1.0"
  },
  
  '1HGBH41JXMN109186': {
    "success": true,
    "timestamp": "2025-08-03T01:46:04.242Z",
    "vin": "1HGBH41JXMN109186",
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
          "max": 21200,
          "description": "Dealer lot price"
        },
        "private_party_value": {
          "min": 17000,
          "max": 19800,
          "description": "Individual seller price"
        },
        "trade_in_value": {
          "min": 15500,
          "max": 17900,
          "description": "Dealer trade value"
        }
      },
      "market_analysis": {
        "demand_level": "High",
        "price_trend": "Strong upward trend due to Honda reliability",
        "regional_variations": "Popular nationwide with consistent demand"
      },
      "key_factors": {
        "condition_impact": "Honda reliability significantly impacts value",
        "mileage_considerations": "Lower mileage commands premium prices",
        "common_issues": "Very few recalls for this model year",
        "resale_outlook": "60-70% value retention after 4 years"
      },
      "strategic_recommendations": {
        "best_time": "Current market is favorable for sellers",
        "negotiation_points": "Emphasize Honda reliability and fuel efficiency",
        "market_positioning": "Strong competitor against Toyota Corolla"
      },
      "risk_assessment": {
        "reliability_concerns": "Very low - among most reliable vehicles",
        "depreciation_outlook": "Excellent value retention",
        "market_saturation": "High demand, low supply"
      },
      "summary": {
        "overall_assessment": "Excellent vehicle with strong market demand",
        "recommended_action": "Excellent time to sell",
        "confidence_level": "Very High"
      }
    },
    "report_id": "VVP-1754185564243",
    "generated_by": "VinValuation Pro API v1.0"
  },
  
  '1FTFW1ET5DFC10312': {
    "success": true,
    "timestamp": "2025-08-03T01:46:04.242Z",
    "vin": "1FTFW1ET5DFC10312",
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
          "min": 22500,
          "max": 26800,
          "description": "Dealer lot price"
        },
        "private_party_value": {
          "min": 20500,
          "max": 24500,
          "description": "Individual seller price"
        },
        "trade_in_value": {
          "min": 18500,
          "max": 22200,
          "description": "Dealer trade value"
        }
      },
      "market_analysis": {
        "demand_level": "Very High",
        "price_trend": "Strong upward trend due to truck demand",
        "regional_variations": "Higher demand in rural and construction areas"
      },
      "key_factors": {
        "condition_impact": "Trucks are work vehicles, condition is critical",
        "mileage_considerations": "High mileage expected but affects value",
        "common_issues": "Some transmission issues reported for this year",
        "resale_outlook": "Good retention due to strong truck market"
      },
      "strategic_recommendations": {
        "best_time": "Current market is excellent for sellers",
        "negotiation_points": "Emphasize towing capacity and reliability",
        "market_positioning": "Strong against Chevy Silverado and Ram 1500"
      },
      "risk_assessment": {
        "reliability_concerns": "Generally reliable but check transmission",
        "depreciation_outlook": "Good - trucks hold value well",
        "market_saturation": "High demand, especially for 4WD models"
      },
      "summary": {
        "overall_assessment": "Solid truck with strong market demand",
        "recommended_action": "Excellent time to sell",
        "confidence_level": "High"
      }
    },
    "report_id": "VVP-1754185564244",
    "generated_by": "VinValuation Pro API v1.0"
  }
};

// Helper function to get mock response
const getMockResponse = (vin) => {
  const mockResponse = MOCK_RESPONSES[vin];
  if (mockResponse) {
    // Update timestamp to current time
    return {
      ...mockResponse,
      timestamp: new Date().toISOString(),
      report_id: `VVP-${Date.now()}`
    };
  }
  return null;
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