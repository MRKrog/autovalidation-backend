// AI Models Pricing and Token Costs - ACCURATE AUGUST 2025
// Verified pricing from official sources; includes caching where applicable

// *********************************************************************************
// CLAUDE AI MODELS PRICING (CURRENT)
// *********************************************************************************

const CLAUDE_MODELS = {
  // Claude 4 Opus (Most Capable - Released May 2025)
  'claude-4-opus': {
    input_cost_per_1m_tokens: 15.00,
    output_cost_per_1m_tokens: 75.00,
    max_tokens: 8192, // Up to 32K in extended mode
    context_window: 200000,
    description: 'Most intelligent Claude model; hybrid reasoning for complex tasks',
    recommended_for: 'Premium analysis, AI agents, advanced coding',
    estimated_cost_per_request: 0.1125, // ~2500 tokens (1500 input + 1000 output)
    estimated_cost_with_caching: 0.045, // With 90% caching savings
    features: ['Frontier intelligence', 'Extended thinking', 'Tool use', 'Prompt caching (up to 90% savings)']
  },

  // Claude 4 Sonnet (Balanced - Released May 2025)
  'claude-4-sonnet': {
    input_cost_per_1m_tokens: 3.00,
    output_cost_per_1m_tokens: 15.00,
    max_tokens: 8192,
    context_window: 200000,
    description: 'Balanced performance for most workflows',
    recommended_for: 'Vehicle valuations, code reviews, high-volume tasks',
    estimated_cost_per_request: 0.0195, // ~2500 tokens
    estimated_cost_with_caching: 0.0078, // With caching
    features: ['Balanced speed/intelligence', 'Hybrid reasoning', 'Tool use', 'Prompt caching']
  },

  // Claude 3.5 Haiku (Fast & Economical)
  'claude-3-5-haiku': {
    input_cost_per_1m_tokens: 0.80,
    output_cost_per_1m_tokens: 4.00,
    max_tokens: 4096,
    context_window: 200000,
    description: 'Fastest and most cost-effective model',
    recommended_for: 'High-volume processing, budget operations',
    estimated_cost_per_request: 0.0052, // ~2500 tokens
    estimated_cost_with_caching: 0.0021, // With caching
    features: ['Fast response', 'Cost-effective', 'Good accuracy', 'Prompt caching']
  },

  // Claude 3 Haiku (Legacy - Very Economical)
  'claude-3-haiku': {
    input_cost_per_1m_tokens: 0.25,
    output_cost_per_1m_tokens: 1.25,
    max_tokens: 4096,
    context_window: 200000,
    description: 'Legacy model, very cost-effective',
    recommended_for: 'Budget-conscious operations, simple tasks',
    estimated_cost_per_request: 0.001625, // ~2500 tokens
    estimated_cost_with_caching: 0.00065, // With caching
    features: ['Very cost-effective', 'Stable', 'Basic tasks', 'Prompt caching']
  }
};

// *********************************************************************************
// GROK AI MODELS PRICING (CURRENT) - CORRECTED
// *********************************************************************************

const GROK_MODELS = {
  // Grok 4 (Flagship - Released July 2025)
  'grok-4': {
    input_cost_per_1m_tokens: 3.00, // CORRECTED from 15.00
    input_cost_per_1m_tokens_cached: 0.75, // 75% savings on cached inputs
    output_cost_per_1m_tokens: 15.00,
    max_tokens: 32768, // Up to 32K output
    context_window: 256000, // 128K in app
    description: 'Most intelligent model; text/vision with tools',
    recommended_for: 'Complex reasoning, STEM, real-time search',
    estimated_cost_per_request: 0.0195, // ~2500 tokens (1500 input + 1000 output)
    estimated_cost_with_caching: 0.015, // With 75% input savings
    features: ['PhD-level reasoning', 'Native tools', 'Real-time search', 'Caching (75% input savings)']
  },

  // Grok 3 (Previous Flagship - Released February 2025)
  'grok-3': {
    input_cost_per_1m_tokens: 3.00,
    input_cost_per_1m_tokens_cached: 0.75,
    output_cost_per_1m_tokens: 15.00,
    max_tokens: 8192,
    context_window: 131072,
    description: 'Strong reasoning for balanced tasks',
    recommended_for: 'Standard operations, research',
    estimated_cost_per_request: 0.0195, // ~2500 tokens
    estimated_cost_with_caching: 0.015, // With caching
    features: ['Reasoning', 'Math/science', 'Real-time data', 'Caching']
  },

  // Grok 3 Mini (Compact & Economical - Released April 2025)
  'grok-3-mini': {
    input_cost_per_1m_tokens: 0.25, // CORRECTED from 0.30
    input_cost_per_1m_tokens_cached: 0.0625, // 75% savings
    output_cost_per_1m_tokens: 1.00, // CORRECTED from 0.50
    max_tokens: 8192,
    context_window: 131072,
    description: 'Lightweight for high-volume',
    recommended_for: 'Budget tasks, quick processing',
    estimated_cost_per_request: 0.001375, // ~2500 tokens (1500 input + 1000 output)
    estimated_cost_with_caching: 0.0011, // With caching
    features: ['Cost-effective', 'Fast', 'Good performance', 'Caching']
  }

  // NOTE: Removed non-existent models:
  // - "Grok 4 Heavy" (this is a multi-agent mode in SuperGrok Heavy subscription, not a separate API model)
  // - "Grok 3 Speed" and "Grok 3 Mini Speed" (these don't exist)
};

// *********************************************************************************
// COST CALCULATION FUNCTIONS (UPDATED WITH CACHING OPTION)
// *********************************************************************************

const calculateTokenCost = (model, inputTokens, outputTokens, cachingPercentage = 0) => {
  const modelInfo = CLAUDE_MODELS[model] || GROK_MODELS[model];
  if (!modelInfo) {
    throw new Error(`Unknown model: ${model}`);
  }

  let effectiveInputRate = modelInfo.input_cost_per_1m_tokens;
  
  // Apply caching if available and specified
  if (cachingPercentage > 0) {
    if (modelInfo.input_cost_per_1m_tokens_cached) {
      // Grok models have specific cached pricing
      const cachedTokens = inputTokens * (cachingPercentage / 100);
      const uncachedTokens = inputTokens * (1 - cachingPercentage / 100);
      const inputCost = (cachedTokens / 1000000) * modelInfo.input_cost_per_1m_tokens_cached + 
                       (uncachedTokens / 1000000) * modelInfo.input_cost_per_1m_tokens;
      const outputCost = (outputTokens / 1000000) * modelInfo.output_cost_per_1m_tokens;
      
      return {
        inputCost: inputCost,
        outputCost: outputCost,
        totalCost: inputCost + outputCost,
        inputTokens: inputTokens,
        outputTokens: outputTokens,
        model: model,
        cachingUsed: cachingPercentage,
        costBreakdown: {
          inputCostPer1M: modelInfo.input_cost_per_1m_tokens,
          cachedInputCostPer1M: modelInfo.input_cost_per_1m_tokens_cached,
          outputCostPer1M: modelInfo.output_cost_per_1m_tokens
        }
      };
    } else {
      // Claude models - general caching reduction
      effectiveInputRate = modelInfo.input_cost_per_1m_tokens * (1 - cachingPercentage / 100);
    }
  }

  const inputCost = (inputTokens / 1000000) * effectiveInputRate;
  const outputCost = (outputTokens / 1000000) * modelInfo.output_cost_per_1m_tokens;
  
  return {
    inputCost: inputCost,
    outputCost: outputCost,
    totalCost: inputCost + outputCost,
    inputTokens: inputTokens,
    outputTokens: outputTokens,
    model: model,
    cachingUsed: cachingPercentage,
    costBreakdown: {
      inputCostPer1M: modelInfo.input_cost_per_1m_tokens,
      effectiveInputWithCache: effectiveInputRate,
      outputCostPer1M: modelInfo.output_cost_per_1m_tokens
    }
  };
};

const estimateVehicleValuationCost = (model, condition = 'good', cachingPercentage = 50) => {
  const baseInputTokens = 1500;
  const baseOutputTokens = 1000;
  
  const conditionMultiplier = {
    'excellent': 1.1,
    'good': 1.0,
    'fair': 1.0,
    'poor': 1.2,
    'salvage': 1.3
  };

  const adjustedInputTokens = Math.round(baseInputTokens * (conditionMultiplier[condition] || 1.0));
  const adjustedOutputTokens = Math.round(baseOutputTokens * (conditionMultiplier[condition] || 1.0));

  return calculateTokenCost(model, adjustedInputTokens, adjustedOutputTokens, cachingPercentage);
};

// *********************************************************************************
// MODEL RECOMMENDATIONS (CORRECTED)
// *********************************************************************************

const getModelRecommendations = (useCase, budget, volume) => {
  const recommendations = {
    'high_volume_budget': {
      primary: 'grok-3-mini',
      secondary: 'claude-3-haiku',
      reasoning: 'Grok 3 Mini offers lowest cost (~$0.0014/request) for high-volume; caching reduces to ~$0.0011'
    },
    'quality_focused': {
      primary: 'claude-4-sonnet',
      secondary: 'grok-3',
      reasoning: 'Claude 4 Sonnet balances quality/cost at ~$0.0195/request; both models same pricing'
    },
    'premium_analysis': {
      primary: 'claude-4-opus',
      secondary: 'grok-4',
      reasoning: 'Claude 4 Opus for frontier intelligence (~$0.11/request); Grok 4 for reasoning with tools (~$0.0195/request)'
    },
    'speed_focused': {
      primary: 'claude-3-5-haiku',
      secondary: 'grok-3-mini',
      reasoning: 'Optimized for fast, low-cost responses'
    },
    'development_testing': {
      primary: 'claude-3-haiku',
      secondary: 'grok-3-mini',
      reasoning: 'Low-cost for testing; ~$0.0014-0.0016/request'
    }
  };

  return recommendations[useCase] || recommendations['quality_focused'];
};

// *********************************************************************************
// COST COMPARISON (CORRECTED)
// *********************************************************************************

const compareModelCosts = () => {
  const testCases = [
    { condition: 'good', tokens: { input: 1500, output: 1000 } },
    { condition: 'excellent', tokens: { input: 1650, output: 1100 } },
    { condition: 'poor', tokens: { input: 1800, output: 1200 } }
  ];

  const models = {
    'Claude 4 Opus': 'claude-4-opus',
    'Claude 4 Sonnet': 'claude-4-sonnet',
    'Claude 3.5 Haiku': 'claude-3-5-haiku',
    'Claude 3 Haiku': 'claude-3-haiku',
    'Grok 4': 'grok-4',
    'Grok 3': 'grok-3',
    'Grok 3 Mini': 'grok-3-mini'
  };

  const comparison = {};

  Object.entries(models).forEach(([name, model]) => {
    comparison[name] = {};
    testCases.forEach(testCase => {
      const cost = calculateTokenCost(model, testCase.tokens.input, testCase.tokens.output, 50); // Assume 50% caching
      const costNoCaching = calculateTokenCost(model, testCase.tokens.input, testCase.tokens.output, 0);
      
      comparison[name][testCase.condition] = {
        totalCost: cost.totalCost,
        totalCostNoCaching: costNoCaching.totalCost,
        cachingSavings: costNoCaching.totalCost - cost.totalCost,
        estimatedMonthlyCost: cost.totalCost * 1000,
        inputCostPer1M: cost.costBreakdown.inputCostPer1M,
        outputCostPer1M: cost.costBreakdown.outputCostPer1M
      };
    });
  });

  return comparison;
};

// *********************************************************************************
// MONTHLY COST PROJECTIONS (UPDATED WITH ACCURATE CACHING)
// *********************************************************************************

const projectMonthlyCosts = (requestsPerMonth, model, cachingPercentage = 50) => {
  const avgCostPerRequest = estimateVehicleValuationCost(model, 'good', cachingPercentage).totalCost;
  const totalCost = avgCostPerRequest * requestsPerMonth;

  return {
    requestsPerMonth: requestsPerMonth,
    model: model,
    avgCostPerRequest: avgCostPerRequest,
    totalMonthlyCost: totalCost,
    costPerDay: totalCost / 30,
    annualCost: totalCost * 12,
    cachingPercentage: cachingPercentage,
    roi_analysis: {
      'consumer_pricing': 4.99,
      'dealer_pricing': 1.00,
      'enterprise_pricing': 0.50,
      'profit_margin_consumer': ((4.99 - avgCostPerRequest) / 4.99) * 100,
      'profit_margin_dealer': ((1.00 - avgCostPerRequest) / 1.00) * 100,
      'profit_margin_enterprise': ((0.50 - avgCostPerRequest) / 0.50) * 100,
      'break_even_requests': Math.ceil(avgCostPerRequest / 0.50)
    }
  };
};

// *********************************************************************************
// COST OPTIMIZATION STRATEGIES (UPDATED)
// *********************************************************************************

const optimizeForCost = (currentModel, requestsPerMonth, targetBudget, cachingPercentage = 50) => {
  const allModels = { ...CLAUDE_MODELS, ...GROK_MODELS };
  const currentCost = projectMonthlyCosts(requestsPerMonth, currentModel, cachingPercentage);
  
  const alternatives = Object.keys(allModels).map(model => {
    const projection = projectMonthlyCosts(requestsPerMonth, model, cachingPercentage);
    return {
      model: model,
      monthlyCost: projection.totalMonthlyCost,
      savings: currentCost.totalMonthlyCost - projection.totalMonthlyCost,
      savingsPercent: ((currentCost.totalMonthlyCost - projection.totalMonthlyCost) / currentCost.totalMonthlyCost) * 100,
      withinBudget: projection.totalMonthlyCost <= targetBudget,
      description: allModels[model].description
    };
  }).filter(alt => alt.monthlyCost < currentCost.totalMonthlyCost)
    .sort((a, b) => a.monthlyCost - b.monthlyCost);

  return {
    currentModel: currentModel,
    currentMonthlyCost: currentCost.totalMonthlyCost,
    targetBudget: targetBudget,
    cachingPercentage: cachingPercentage,
    alternatives: alternatives.slice(0, 5),
    recommendations: alternatives.filter(alt => alt.withinBudget).slice(0, 3)
  };
};

// *********************************************************************************
// FEATURE COMPARISON (UPDATED)
// *********************************************************************************

const compareFeatures = () => {
  const allModels = { ...CLAUDE_MODELS, ...GROK_MODELS };
  
  return Object.entries(allModels).map(([modelId, model]) => ({
    model: modelId,
    inputCost: model.input_cost_per_1m_tokens,
    outputCost: model.output_cost_per_1m_tokens,
    contextWindow: model.context_window,
    maxTokens: model.max_tokens,
    estimatedCost: model.estimated_cost_per_request,
    estimatedCostWithCaching: model.estimated_cost_with_caching,
    features: model.features,
    recommendedFor: model.recommended_for,
    description: model.description,
    provider: modelId.includes('claude') ? 'Anthropic' : 'xAI',
    released: modelId.includes('4') ? '2025' : modelId.includes('3.5') || modelId.includes('3') ? '2024-2025' : 'Legacy'
  })).sort((a, b) => a.estimatedCost - b.estimatedCost);
};

// *********************************************************************************
// EXPORTS
// *********************************************************************************

module.exports = {
  CLAUDE_MODELS,
  GROK_MODELS,
  calculateTokenCost,
  estimateVehicleValuationCost,
  getModelRecommendations,
  compareModelCosts,
  projectMonthlyCosts,
  optimizeForCost,
  compareFeatures
};

// *********************************************************************************
// USAGE EXAMPLES (CORRECTED)
// *********************************************************************************

/*
// Example usage with corrected pricing:

// Calculate cost for a vehicle valuation
const cost = estimateVehicleValuationCost('grok-3-mini', 'good', 50);
console.log('Cost per valuation:', cost.totalCost); // ~$0.0011

// Get model recommendations
const recommendations = getModelRecommendations('high_volume_budget');
console.log('Recommended model:', recommendations.primary); // grok-3-mini

// Project monthly costs
const monthlyCosts = projectMonthlyCosts(1000, 'grok-3-mini', 50);
console.log('Monthly cost for 1000 requests:', monthlyCosts.totalMonthlyCost); // ~$1.10

// Compare all models
const comparison = compareFeatures();
console.log('Cheapest option:', comparison[0]); // grok-3-mini

// Cost comparison showing savings:
// Grok 3 Mini: ~$0.0011/request (cheapest)
// Claude 3 Haiku: ~$0.0016/request
// Claude 3.5 Haiku: ~$0.0052/request  
// Claude 4 Sonnet / Grok 3/4: ~$0.0195/request
// Claude 4 Opus: ~$0.1125/request (premium)

// With 50% caching:
// Costs can be reduced by 25-75% depending on model and caching efficiency
*/