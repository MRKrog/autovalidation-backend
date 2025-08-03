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