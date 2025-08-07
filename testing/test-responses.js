
const MOCK_RESPONSES = {
  // Subaru WRX STI - Claude opus 4.1 - $0.17 8/7/25
  'JF1GR8H6XBL831881': {
    "success": true,
    "timestamp": "2025-08-07T23:26:35.072Z",
    "report_id": "DVai-1754609195072",
    "generated_by": "DriveValueAI API v2.0",
    "vehicle": {
        "vin": "JF1GR8H6XBL831881",
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
    "valuation_parameters": {
        "condition": "good",
        "mileage": {
            "actual": 80000,
            "expected": 168000,
            "status": "below_average",
            "variance_percentage": 52
        }
    },
    "baseline_data": {
        "source": "auto.dev",
        "retail_value": 14403,
        "private_party_value": 12256,
        "trade_in_value": 10702,
        "tmv_rating": 0,
        "data_quality": "actual",
        "note": "Baseline values provided for reference - AI analysis provides enhanced accuracy"
    },
    "ai_valuation": {
        "market_values": {
            "retail_value": {
                "min": 22000,
                "max": 28000,
                "suggested_ai_price": 25500,
                "description": "AI-determined dealer retail price range for good condition",
                "baseline_comparison": "My value is 77% higher than baseline $14,403. Baseline severely undervalues low-mileage STI hatchbacks which are now discontinued and highly sought after by enthusiasts",
                "confidence_level": "High - STI hatchbacks command significant premiums in 2025 enthusiast market"
            },
            "private_party_value": {
                "min": 19500,
                "max": 24500,
                "suggested_ai_price": 22000,
                "description": "AI-determined private seller realistic range for good condition",
                "baseline_comparison": "My value is 80% higher than baseline $12,256. Private market for clean STI hatches is extremely strong due to rarity and enthusiast demand",
                "confidence_level": "High - Recent comparable sales support this range"
            },
            "trade_in_value": {
                "min": 16000,
                "max": 19500,
                "suggested_ai_price": 17500,
                "description": "AI-determined dealer trade-in offer range for good condition",
                "baseline_comparison": "My value is 64% higher than baseline $10,702. Dealers recognize the resale value of low-mileage STI hatchbacks",
                "confidence_level": "Medium-High - Trade values vary by dealer specialization"
            },
            "auction_value": {
                "min": 17000,
                "max": 21000,
                "suggested_ai_price": 19000,
                "description": "AI-determined wholesale/auction expected range",
                "baseline_comparison": "Significantly higher than baseline due to strong dealer demand for clean STI inventory",
                "confidence_level": "Medium - Auction values depend on buyer competition"
            }
        },
        "analysis": {
            "primary_value_drivers": "1) Extremely low mileage (58% below average), 2) Last-gen STI hatchback (discontinued), 3) Strong enthusiast/collector demand, 4) Clean condition, 5) Rising JDM values",
            "baseline_comparison": "Baseline treats this as generic used Subaru, missing: enthusiast premium, hatchback rarity, mileage significance, market appreciation trend",
            "market_position": "Positioned as future classic in 2025. Competition from new cars at $35k+ makes clean used STIs attractive",
            "pricing_strategy": "Aggressive pricing justified by market evidence and rarity. Conservative only on trade-in to account for dealer margins",
            "ai_advantages": "AI recognizes collector market dynamics, discontinued model premium, and enthusiast valuation patterns baseline misses"
        },
        "value_adjustments": {
            "mileage_impact": "+$7,500 for 80k vs 189k average. Each 10k miles below average adds ~$700-900 value for STIs",
            "condition_impact": "Good condition baseline. Excellent would add $2-3k more",
            "market_trend_adjustment": "+$4,000 for 2025 enthusiast market appreciation and inflation since baseline data",
            "brand_premium_discount": "+$2,500 STI badge premium over standard WRX, growing annually",
            "total_adjustment": "+$11,000 to +$14,000 from baseline due to cumulative factors"
        },
        "performance_assessment": {
            "engine_assessment": "305hp 2.5L EJ257 is legendary among enthusiasts. Known for modification potential. Strong aftermarket support maintains value",
            "drivetrain_impact": "Symmetrical AWD with driver-controlled center differential highly valued for performance and winter capability",
            "transmission_preference": "6-speed manual is only option and highly preferred. No CVT dilution of brand. Adds 15-20% value in enthusiast market",
            "fuel_economy_impact": "20mpg combined acceptable for performance class. Buyers prioritize performance over efficiency in this segment"
        },
        "market_intelligence": {
            "demand_level": "Very high demand for clean STI hatchbacks. Limited supply drives prices. Younger buyers entering market with nostalgia factor",
            "price_trend": "Appreciating 8-12% annually for clean examples. Outpacing inflation and general used car market",
            "seasonal_factors": "Strong year-round demand. Slight premium in fall/winter for AWD capability. Spring sees enthusiast buying surge",
            "regional_variations": "Premium markets: Pacific Northwest, Colorado, Northeast. 10-15% higher in snow states and enthusiast hubs"
        },
        "risk_analysis": {
            "maintenance_costs": "Higher than average. Turbo engines require premium fuel, synthetic oil. Budget $1,500-2,000 annually",
            "reliability_outlook": "EJ engines can have head gasket issues if not maintained. Low mileage reduces risk. Enthusiast ownership often means better care",
            "parts_availability": "Excellent aftermarket support. OEM parts available but pricey. Performance parts abundant",
            "age_concerns": "14 years old but low mileage mitigates. Check for ringland failure history. Timing belt due if not done"
        },
        "recommendations": {
            "selling_strategy": "Market to enthusiasts through specialized forums, Cars & Bids, Bring a Trailer. Highlight originality and maintenance history",
            "timing_advice": "Hold if possible - values climbing. If selling, spring 2025 optimal for enthusiast activity. Avoid end-of-year",
            "negotiation_points": "Low mileage is key leverage. Hatchback rarity crucial. Service records add $1-2k value. Stock condition preferred",
            "documentation_needed": "Complete service history, timing belt records, compression test results, clean Carfax, original window sticker if available"
        },
        "confidence_metrics": {
            "overall_confidence": {
                "data_quality": "High",
                "market_volatility": "Stable appreciation trend for STIs",
                "valuation_accuracy": "±10% range accounting for specific condition variables",
                "ai_advantage": "50-80% more accurate than baseline by recognizing enthusiast market dynamics",
                "market_factors": "2025 sees continued ICE performance car appreciation as EVs dominate mainstream"
            },
            "validation_results": {
                "is_valid": true,
                "confidence": "high",
                "warnings": [],
                "errors": [],
                "suggested_adjustments": {}
            }
        }
    },
    "summary": {
        "recommended_price": {
            "retail": 25500,
            "private_party": 22000,
            "trade_in": 17500
        },
        "key_highlights": [
            "52% below average mileage",
            "AI valuation above baseline by 77%",
            "Aggressive pricing strategy"
        ],
        "confidence_level": "±10% range accounting for specific condition variables"
    }
  },

  // 
};

// Helper function to get mock response with condition adjustment
const getMockResponse = (vin) => {

  const mockResponse = MOCK_RESPONSES[vin];
  if (mockResponse) {
    return {
      ...mockResponse,
      timestamp: new Date().toISOString(),
      report_id: `DVai-${Date.now()}`
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