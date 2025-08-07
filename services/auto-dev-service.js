const axios = require('axios');
const { structureVehicleData } = require('../utilities/vehicle-helpers');

require('dotenv').config();

// Auto.dev API integration
const analyzeVehicleWithAutoDev = async (vin) => {
  console.log(`🧠 Generating vehicle analysis with Auto.dev: ${vin}...`);
  
  try {

    const autoDevResponse = await axios.get(
      `https://auto.dev/api/vin/${vin}?apikey=${process.env.AUTO_DEV_API_KEY}`
    );

    const rawVehicleSpecs = autoDevResponse.data;
    const vehicleData = structureVehicleData(rawVehicleSpecs, vin);
    
    return vehicleData;
  } catch (error) {
    console.error('❌ Auto.dev API error:', error);
    
    // Handle specific Claude API errors
    if (error.status === 429) {
      throw new Error('Rate limit exceeded - too many requests to Claude');
    } else if (error.status === 401) {
      throw new Error('Invalid Auto.dev API key');
    } else if (error.status === 400) {
      throw new Error('Invalid request to Auto.dev API');
    } else {
      throw new Error(`Auto.dev generation failed: ${error.message}`);
    }
  }
};

module.exports = {
  analyzeVehicleWithAutoDev
}; 