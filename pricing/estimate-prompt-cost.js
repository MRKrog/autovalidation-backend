// Simple token counter and cost calculator
const { calculateTokenCost } = require('./ai-models-pricing'); // Your pricing file

class SimpleTokenCounter {
  // Estimate token count (more accurate for technical content)
  static estimateTokens(text) {
    if (!text) return 0;
    // Adjusted for automotive technical content
    return Math.ceil(text.length / 3.8);
  }

  // Log token usage and cost for a single request
  static logTokenUsage(model, inputText, outputText, additionalInfo = {}) {
    const inputTokens = this.estimateTokens(inputText);
    const outputTokens = this.estimateTokens(outputText);
    
    // Calculate cost using your accurate pricing
    const costs = calculateTokenCost(model, inputTokens, outputTokens, 0); // No caching for now
    
    const logData = {
      timestamp: new Date().toISOString(),
      model: model,
      provider: model.includes('claude') ? 'Anthropic' : 'xAI',
      tokens: {
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens
      },
      costs: {
        input: costs.inputCost,
        output: costs.outputCost,
        total: costs.totalCost
      },
      text_lengths: {
        input: inputText?.length || 0,
        output: outputText?.length || 0
      },
      efficiency: {
        tokensPerInputChar: inputTokens / (inputText?.length || 1),
        tokensPerOutputChar: outputTokens / (outputText?.length || 1)
      },
      ...additionalInfo
    };

    // Console logging
    console.log(`📊 Token Usage: ${inputTokens} → ${outputTokens} tokens (${inputTokens + outputTokens} total)`);
    console.log(`💰 Cost: $${costs.totalCost.toFixed(4)} (Input: $${costs.inputCost.toFixed(4)}, Output: $${costs.outputCost.toFixed(4)})`);
    console.log(`⚡ Efficiency: ${(inputTokens + outputTokens).toLocaleString()} tokens for ${(inputText?.length + outputText?.length || 0).toLocaleString()} characters`);
    
    if (additionalInfo.vehicleInfo) {
      console.log(`🚗 Vehicle: ${additionalInfo.vehicleInfo}`);
    }

    return logData;
  }

  // Quick cost estimate before making request
  static estimateCost(model, promptText) {
    const inputTokens = this.estimateTokens(promptText);
    const estimatedOutputTokens = 1500; // Your typical response size
    
    const costs = calculateTokenCost(model, inputTokens, estimatedOutputTokens, 0);
    
    console.log(`💡 Estimated cost for ${model}: $${costs.totalCost.toFixed(4)} (${inputTokens}→~${estimatedOutputTokens} tokens)`);
    
    return {
      inputTokens,
      estimatedOutputTokens,
      estimatedCost: costs.totalCost
    };
  }
}

module.exports = { SimpleTokenCounter };